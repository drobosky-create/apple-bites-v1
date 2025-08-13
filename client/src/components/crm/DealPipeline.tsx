import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardContent, Chip, IconButton } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import DealFormModal from './DealFormModal';
import { Plus, Eye, Mail, DollarSign } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Deal stages configuration
const DEAL_STAGES = [
  { id: 'prospect', name: 'Prospect Identified', color: '#f3f4f6' },
  { id: 'initial', name: 'Initial Contact', color: '#dbeafe' },
  { id: 'qualification', name: 'Qualification', color: '#bfdbfe' },
  { id: 'needs', name: 'Needs Analysis', color: '#93c5fd' },
  { id: 'proposal_prep', name: 'Proposal Preparation', color: '#60a5fa' },
  { id: 'proposal_presented', name: 'Proposal Presented', color: '#3b82f6' },
  { id: 'negotiation', name: 'Negotiation', color: '#2563eb' },
  { id: 'contract', name: 'Contract Review', color: '#1d4ed8' },
  { id: 'due_diligence', name: 'Due Diligence', color: '#1e40af' },
  { id: 'closing', name: 'Closing Preparation', color: '#1e3a8a' },
  { id: 'closed_won', name: 'Closed Won', color: '#059669' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#dc2626' },
  { id: 'closed_hold', name: 'On Hold', color: '#d97706' },
  { id: 'follow_up', name: 'Follow Up', color: '#7c3aed' }
];

const DealPipeline = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedDeal, setSelectedDeal] = useState(null);

  const queryClient = useQueryClient();
  const { data: deals = [], isLoading } = useQuery({ queryKey: ['/api/deals'] });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      apiRequest('PUT', `/api/deals/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });

  // Group deals by stage
  const dealsByStage = deals.reduce((acc: any, deal: any) => {
    const stage = deal.currentStage || 'prospect';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(deal);
    return acc;
  }, {});

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    updateDealMutation.mutate({
      id: dealId,
      updates: { currentStage: newStage }
    });
  };

  if (isLoading) {
    return (
      <MDBox p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </MDBox>
    );
  }

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Deal Pipeline
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Track deals through your 14-stage pipeline
          </MDTypography>
        </MDBox>
        <MDBox display="flex" gap={2}>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => {
              setModalType('create');
              setSelectedDeal(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} />
            &nbsp;New Deal
          </MDButton>
          <MDButton
            variant="outlined"
            color="primary"
            onClick={() => console.log('Email campaign feature')}
          >
            <Mail size={16} />
            &nbsp;Email Campaign
          </MDButton>
        </MDBox>
      </MDBox>

      <DragDropContext onDragEnd={handleDragEnd}>
        <MDBox display="flex" gap={2} overflow="auto" pb={2}>
          {DEAL_STAGES.map((stage) => (
            <MDBox key={stage.id} minWidth="280px">
              <Card sx={{ backgroundColor: stage.color }}>
                <CardHeader 
                  title={
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="bold">
                        {stage.name}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {dealsByStage[stage.id]?.length || 0} deals
                      </MDTypography>
                    </MDBox>
                  }
                />
                <CardContent>
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <MDBox
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        minHeight="200px"
                        bgcolor={snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent'}
                        borderRadius={1}
                        p={1}
                      >
                        {(dealsByStage[stage.id] || []).map((deal: any, index: number) => (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 1,
                                  cursor: 'grab',
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                  transform: snapshot.isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <MDTypography variant="subtitle2" fontWeight="bold">
                                    {deal.dealName}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text">
                                    {deal.transactionType}
                                  </MDTypography>
                                  <MDBox display="flex" justifyContent="between" alignItems="center" mt={1}>
                                    <Chip 
                                      label={`${deal.probabilityOfClose || 0}%`} 
                                      size="small" 
                                      color="primary"
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedDeal(deal);
                                        setModalType('view');
                                        setShowModal(true);
                                      }}
                                    >
                                      <Eye size={14} />
                                    </IconButton>
                                  </MDBox>
                                  {deal.estimatedValue && (
                                    <MDBox display="flex" alignItems="center" mt={1}>
                                      <DollarSign size={14} style={{ marginRight: '4px' }} />
                                      <MDTypography variant="caption" fontWeight="bold">
                                        ${parseInt(deal.estimatedValue).toLocaleString()}
                                      </MDTypography>
                                    </MDBox>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </MDBox>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </MDBox>
          ))}
        </MDBox>
      </DragDropContext>

      {deals.length === 0 && (
        <MDBox textAlign="center" py={6}>
          <MDTypography variant="h6" color="text">
            No deals in pipeline
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={2}>
            Create your first deal to start tracking opportunities
          </MDTypography>
        </MDBox>
      )}

      {showModal && (
        <DealFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          mode={modalType}
          deal={selectedDeal}
        />
      )}
    </MDBox>
  );
};

export default DealPipeline;