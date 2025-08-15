import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, Avatar, IconButton } from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import { MoreVert, AttachMoney, Schedule, Business } from "@mui/icons-material";
import { apiRequest } from "@/lib/queryClient";

interface Deal {
  id: number;
  title: string;
  value?: number;
  stage: string;
  expectedCloseDate?: string;
  firmName?: string;
  contactName?: string;
  probability?: number;
  createdAt: string;
  updatedAt: string;
}

const DEAL_STAGES = [
  { id: "prospecting", name: "Prospecting", color: "#2196f3" },
  { id: "qualified", name: "Qualified", color: "#ff9800" },
  { id: "proposal", name: "Proposal", color: "#9c27b0" },
  { id: "negotiation", name: "Negotiation", color: "#f44336" },
  { id: "closed-won", name: "Closed Won", color: "#4caf50" },
  { id: "closed-lost", name: "Closed Lost", color: "#757575" },
];

function formatCurrency(value?: number): string {
  if (!value) return "No value";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString?: string): string {
  if (!dateString) return "No date";
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  return (
    <Draggable draggableId={deal.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2,
            cursor: 'grab',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging ? 3 : 1,
            '&:hover': {
              boxShadow: 2,
            }
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <MDTypography variant="h6" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                {deal.title}
              </MDTypography>
              <IconButton size="small" sx={{ p: 0.5 }}>
                <MoreVert fontSize="small" />
              </IconButton>
            </MDBox>

            {deal.firmName && (
              <MDBox display="flex" alignItems="center" mb={1}>
                <Business sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                <MDTypography variant="caption" color="text">
                  {deal.firmName}
                </MDTypography>
              </MDBox>
            )}

            {deal.value && (
              <MDBox display="flex" alignItems="center" mb={1}>
                <AttachMoney sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                <MDTypography variant="body2" fontWeight="medium" color="success">
                  {formatCurrency(deal.value)}
                </MDTypography>
              </MDBox>
            )}

            {deal.expectedCloseDate && (
              <MDBox display="flex" alignItems="center" mb={1}>
                <Schedule sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                <MDTypography variant="caption" color="text">
                  {formatDate(deal.expectedCloseDate)}
                </MDTypography>
              </MDBox>
            )}

            <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              {deal.contactName && (
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  {deal.contactName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              
              {deal.probability && (
                <Chip 
                  label={`${deal.probability}%`} 
                  size="small"
                  color={deal.probability >= 75 ? 'success' : deal.probability >= 50 ? 'warning' : 'default'}
                />
              )}
            </MDBox>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

function StageColumn({ stage, deals, totalValue }: { 
  stage: typeof DEAL_STAGES[0]; 
  deals: Deal[]; 
  totalValue: number;
}) {
  return (
    <MDBox sx={{ minWidth: 300, mx: 1 }}>
      <MDBox
        sx={{
          backgroundColor: stage.color,
          color: 'white',
          p: 2,
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <MDTypography variant="h6" fontWeight="bold">
          {stage.name}
        </MDTypography>
        <MDBox textAlign="right">
          <MDTypography variant="caption" sx={{ opacity: 0.8 }}>
            {deals.length} deals
          </MDTypography>
          <MDTypography variant="caption" display="block" sx={{ opacity: 0.8 }}>
            {formatCurrency(totalValue)}
          </MDTypography>
        </MDBox>
      </MDBox>

      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <MDBox
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'white',
              minHeight: 400,
              p: 2,
              borderRadius: '0 0 8px 8px',
              border: '1px solid #e0e0e0',
              borderTop: 'none',
            }}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {provided.placeholder}
          </MDBox>
        )}
      </Droppable>
    </MDBox>
  );
}

export default function Kanban() {
  const queryClient = useQueryClient();
  const [deals, setDeals] = useState<Deal[]>([]);

  // Fetch deals
  const { data: fetchedDeals, isLoading } = useQuery({
    queryKey: ['/api/crm/deals'],
    enabled: true,
  });

  // Update deal mutation
  const updateDealMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Deal> }) => {
      return apiRequest('PATCH', `/api/crm/deals/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/deals'] });
    },
  });

  useEffect(() => {
    if (fetchedDeals) {
      setDeals(fetchedDeals);
    }
  }, [fetchedDeals]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Update the deal stage
    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Optimistic update
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );

    // API update
    updateDealMutation.mutate({
      id: dealId,
      updates: { stage: newStage }
    });
  };

  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <MDTypography>Loading deals...</MDTypography>
      </MDBox>
    );
  }

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.map(stage => ({
    stage,
    deals: deals.filter(deal => deal.stage === stage.id),
    totalValue: deals
      .filter(deal => deal.stage === stage.id)
      .reduce((sum, deal) => sum + (deal.value || 0), 0)
  }));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <MDBox 
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          pb: 2,
          minHeight: '500px'
        }}
      >
        {dealsByStage.map(({ stage, deals, totalValue }) => (
          <StageColumn 
            key={stage.id} 
            stage={stage} 
            deals={deals} 
            totalValue={totalValue}
          />
        ))}
      </MDBox>
    </DragDropContext>
  );
}