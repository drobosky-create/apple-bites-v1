import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardContent, Chip, IconButton, Avatar, AvatarGroup, Tooltip, Grid } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import DealFormModal from './DealFormModal';
import { 
  Plus, 
  Eye, 
  Mail, 
  DollarSign, 
  Clock, 
  Calendar, 
  User, 
  AlertTriangle,
  TrendingUp,
  Phone,
  FileText,
  Building2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Enhanced deal stages with more detailed configuration
const DEAL_STAGES = [
  { 
    id: 'prospect', 
    name: 'Prospect Identified', 
    color: '#f3f4f6',
    textColor: '#374151',
    probability: 10,
    avgDays: 7
  },
  { 
    id: 'initial', 
    name: 'Initial Contact', 
    color: '#dbeafe',
    textColor: '#1e40af',
    probability: 20,
    avgDays: 14
  },
  { 
    id: 'qualification', 
    name: 'Qualification', 
    color: '#bfdbfe',
    textColor: '#1d4ed8',
    probability: 30,
    avgDays: 21
  },
  { 
    id: 'needs', 
    name: 'Needs Analysis', 
    color: '#93c5fd',
    textColor: '#1e3a8a',
    probability: 40,
    avgDays: 28
  },
  { 
    id: 'proposal_prep', 
    name: 'Proposal Preparation', 
    color: '#60a5fa',
    textColor: '#ffffff',
    probability: 50,
    avgDays: 35
  },
  { 
    id: 'proposal_presented', 
    name: 'Proposal Presented', 
    color: '#3b82f6',
    textColor: '#ffffff',
    probability: 60,
    avgDays: 42
  },
  { 
    id: 'negotiation', 
    name: 'Negotiation', 
    color: '#2563eb',
    textColor: '#ffffff',
    probability: 70,
    avgDays: 49
  },
  { 
    id: 'contract', 
    name: 'Contract Review', 
    color: '#1d4ed8',
    textColor: '#ffffff',
    probability: 80,
    avgDays: 56
  },
  { 
    id: 'due_diligence', 
    name: 'Due Diligence', 
    color: '#1e40af',
    textColor: '#ffffff',
    probability: 85,
    avgDays: 63
  },
  { 
    id: 'closing', 
    name: 'Closing Preparation', 
    color: '#1e3a8a',
    textColor: '#ffffff',
    probability: 90,
    avgDays: 70
  },
  { 
    id: 'closed_won', 
    name: 'Closed Won', 
    color: '#059669',
    textColor: '#ffffff',
    probability: 100,
    avgDays: 0
  },
  { 
    id: 'closed_lost', 
    name: 'Closed Lost', 
    color: '#dc2626',
    textColor: '#ffffff',
    probability: 0,
    avgDays: 0
  },
  { 
    id: 'closed_hold', 
    name: 'On Hold', 
    color: '#d97706',
    textColor: '#ffffff',
    probability: 50,
    avgDays: 0
  },
  { 
    id: 'follow_up', 
    name: 'Follow Up', 
    color: '#7c3aed',
    textColor: '#ffffff',
    probability: 25,
    avgDays: 14
  }
];

const EnhancedDealPipeline = () => {
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

  // Calculate stage totals
  const stageValues = DEAL_STAGES.reduce((acc, stage) => {
    const stageDeals = dealsByStage[stage.id] || [];
    acc[stage.id] = stageDeals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
    return acc;
  }, {} as Record<string, number>);

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

  const getDaysInStage = (deal: any) => {
    if (!deal.stageChangeDate) return 0;
    const stageDate = new Date(deal.stageChangeDate);
    const today = new Date();
    return Math.floor((today.getTime() - stageDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getTeamMembers = (deal: any) => {
    // Mock team assignment - in real app this would come from deal data
    const teamMembers = [
      { name: 'John Smith', avatar: 'JS', color: '#3B82F6' },
      { name: 'Sarah Johnson', avatar: 'SJ', color: '#059669' },
      { name: 'Mike Wilson', avatar: 'MW', color: '#8B5CF6' }
    ];
    return teamMembers.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const getPriorityIcon = (deal: any) => {
    const value = deal.value || 0;
    if (value > 5000000) return <AlertTriangle size={14} color="#DC2626" />;
    if (value > 1000000) return <TrendingUp size={14} color="#F59E0B" />;
    return null;
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
      {/* Header with Analytics */}
      <MDBox mb={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              Deal Pipeline
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Comprehensive M&A deal tracking and management
            </MDTypography>
          </MDBox>
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<Plus size={20} />}
            onClick={() => {
              setModalType('create');
              setSelectedDeal(null);
              setShowModal(true);
            }}
          >
            New Deal
          </MDButton>
        </MDBox>

        {/* Pipeline Summary */}
        <MDBox 
          p={2} 
          sx={{ 
            backgroundColor: '#F8FAFC', 
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Total Pipeline
                </MDTypography>
                <MDTypography variant="h5" fontWeight="bold" color="dark">
                  ${(Object.values(stageValues).reduce((a: number, b: number) => a + b, 0) / 1000000).toFixed(1)}M
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={3}>
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Active Deals
                </MDTypography>
                <MDTypography variant="h5" fontWeight="bold" color="dark">
                  {deals.filter((d: any) => !['closed_won', 'closed_lost'].includes(d.currentStage)).length}
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={3}>
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Weighted Pipeline
                </MDTypography>
                <MDTypography variant="h5" fontWeight="bold" color="success">
                  ${(DEAL_STAGES.reduce((sum, stage) => {
                    const stageDeals = dealsByStage[stage.id] || [];
                    return sum + stageDeals.reduce((stageSum: number, deal: any) => 
                      stageSum + ((deal.value || 0) * (stage.probability / 100)), 0);
                  }, 0) / 1000000).toFixed(1)}M
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={3}>
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Avg Deal Size
                </MDTypography>
                <MDTypography variant="h5" fontWeight="bold" color="dark">
                  ${deals.length > 0 ? ((Object.values(stageValues).reduce((a: number, b: number) => a + b, 0) / deals.length) / 1000000).toFixed(1) : 0}M
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      {/* Enhanced Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <MDBox sx={{ overflowX: 'auto', pb: 2 }}>
          <MDBox display="flex" gap={3} sx={{ minWidth: 'max-content' }}>
            {DEAL_STAGES.map((stage) => {
              const stageDeals = dealsByStage[stage.id] || [];
              const stageValue = stageValues[stage.id] || 0;
              
              return (
                <MDBox key={stage.id} sx={{ minWidth: '320px', maxWidth: '320px' }}>
                  {/* Stage Header */}
                  <MDBox 
                    p={2} 
                    mb={2}
                    sx={{ 
                      backgroundColor: stage.color,
                      borderRadius: '8px',
                      color: stage.textColor
                    }}
                  >
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="h6" fontWeight="bold" sx={{ color: stage.textColor }}>
                        {stage.name}
                      </MDTypography>
                      <Chip 
                        label={stageDeals.length} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: stage.textColor,
                          fontWeight: 'bold'
                        }} 
                      />
                    </MDBox>
                    <MDTypography variant="body2" sx={{ color: stage.textColor, opacity: 0.9 }}>
                      ${(stageValue / 1000000).toFixed(1)}M • {stage.probability}% prob
                    </MDTypography>
                  </MDBox>

                  {/* Droppable Area */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <MDBox
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: '400px',
                          backgroundColor: snapshot.isDraggingOver ? '#F1F5F9' : 'transparent',
                          borderRadius: '8px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        {stageDeals.map((deal: any, index: number) => {
                          const daysInStage = getDaysInStage(deal);
                          const teamMembers = getTeamMembers(deal);
                          const priorityIcon = getPriorityIcon(deal);
                          
                          return (
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
                                    mb: 2,
                                    cursor: 'grab',
                                    '&:active': { cursor: 'grabbing' },
                                    transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                    boxShadow: snapshot.isDragging ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'box-shadow 0.2s'
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    {/* Deal Header */}
                                    <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                      <MDBox>
                                        <MDBox display="flex" alignItems="center" gap={1}>
                                          {priorityIcon}
                                          <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                                            {deal.title || 'Untitled Deal'}
                                          </MDTypography>
                                        </MDBox>
                                        <MDTypography variant="caption" color="text">
                                          {deal.companyName || 'Unknown Company'}
                                        </MDTypography>
                                      </MDBox>
                                      <IconButton 
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDeal(deal);
                                          setModalType('view');
                                          setShowModal(true);
                                        }}
                                      >
                                        <Eye size={16} />
                                      </IconButton>
                                    </MDBox>

                                    {/* Deal Value */}
                                    <MDBox display="flex" alignItems="center" mb={2}>
                                      <DollarSign size={16} color="#059669" />
                                      <MDTypography variant="h6" fontWeight="bold" color="success" ml={0.5}>
                                        ${((deal.value || 0) / 1000000).toFixed(1)}M
                                      </MDTypography>
                                    </MDBox>

                                    {/* Time in Stage */}
                                    <MDBox display="flex" alignItems="center" mb={2}>
                                      <Clock size={14} color="#6B7280" />
                                      <MDTypography variant="caption" color="text" ml={0.5}>
                                        {daysInStage} days in stage
                                      </MDTypography>
                                      {daysInStage > (stage.avgDays || 30) && (
                                        <AlertTriangle size={12} color="#F59E0B" style={{ marginLeft: 4 }} />
                                      )}
                                    </MDBox>

                                    {/* Team Members */}
                                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                        {teamMembers.map((member, idx) => (
                                          <Tooltip key={idx} title={member.name}>
                                            <Avatar sx={{ bgcolor: member.color }}>
                                              {member.avatar}
                                            </Avatar>
                                          </Tooltip>
                                        ))}
                                      </AvatarGroup>
                                      
                                      {/* Quick Actions */}
                                      <MDBox display="flex" gap={0.5}>
                                        <IconButton size="small" sx={{ p: 0.5 }}>
                                          <Phone size={12} />
                                        </IconButton>
                                        <IconButton size="small" sx={{ p: 0.5 }}>
                                          <Mail size={12} />
                                        </IconButton>
                                        <IconButton size="small" sx={{ p: 0.5 }}>
                                          <Calendar size={12} />
                                        </IconButton>
                                      </MDBox>
                                    </MDBox>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </MDBox>
                    )}
                  </Droppable>
                </MDBox>
              );
            })}
          </MDBox>
        </MDBox>
      </DragDropContext>

      {/* Deal Modal */}
      {showModal && (
        <DealFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          deal={selectedDeal}
          mode={modalType}
        />
      )}
    </MDBox>
  );
};

export default EnhancedDealPipeline;