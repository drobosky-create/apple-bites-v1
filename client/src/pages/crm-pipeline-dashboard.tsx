import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Tooltip,
  LinearProgress,
  Box
} from '@mui/material';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';

import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Building2,
  Target as TargetIcon,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  FileText,
  User,
  Activity,
  Grid3X3,
  List,
  Clock,
  AlertTriangle
} from 'lucide-react';

import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import ContactFormModal from '@/components/crm/ContactFormModal';
import DealFormModal from '@/components/crm/DealFormModal';
import FirmFormModal from '@/components/crm/FirmFormModal';
import EmailCampaignModal from '@/components/crm/EmailCampaignModal';

// Deal stages configuration
const DEAL_STAGES = [
  { id: 'prospect', name: 'Prospect Identified', color: '#e3f2fd', textColor: '#0d47a1', probability: 10 },
  { id: 'initial', name: 'Initial Contact', color: '#f3e5f5', textColor: '#4a148c', probability: 20 },
  { id: 'qualification', name: 'Qualification', color: '#e8f5e8', textColor: '#1b5e20', probability: 30 },
  { id: 'needs', name: 'Needs Analysis', color: '#fff3e0', textColor: '#e65100', probability: 40 },
  { id: 'proposal_prep', name: 'Proposal Preparation', color: '#fce4ec', textColor: '#880e4f', probability: 50 },
  { id: 'proposal_presented', name: 'Proposal Presented', color: '#e0f2f1', textColor: '#004d40', probability: 60 },
  { id: 'negotiation', name: 'Negotiation', color: '#f1f8e9', textColor: '#33691e', probability: 70 },
  { id: 'contract', name: 'Contract Review', color: '#fff8e1', textColor: '#ff6f00', probability: 80 },
  { id: 'due_diligence', name: 'Due Diligence', color: '#e8eaf6', textColor: '#283593', probability: 85 },
  { id: 'closing', name: 'Closing Preparation', color: '#f9fbe7', textColor: '#827717', probability: 90 },
  { id: 'closed_won', name: 'Closed Won', color: '#e8f5e8', textColor: '#2e7d32', probability: 100 },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ffebee', textColor: '#c62828', probability: 0 },
  { id: 'closed_hold', name: 'Closed Hold', color: '#f5f5f5', textColor: '#616161', probability: 0 },
  { id: 'follow_up', name: 'Follow Up', color: '#e1f5fe', textColor: '#0277bd', probability: 15 }
];

// View mode type
type ViewMode = 'kanban' | 'table';

// Priority levels
const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#4caf50' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'urgent', label: 'Urgent', color: '#9c27b0' }
];

// Deal card component for Kanban view
const DealCard = ({ deal, index }: { deal: any; index: number }) => {
  const priorityConfig = PRIORITY_LEVELS.find(p => p.value === deal.priority) || PRIORITY_LEVELS[0];
  
  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : "none"
          }}
        >
          <Card 
            sx={{ 
              mb: 2, 
              cursor: 'grab',
              boxShadow: snapshot.isDragging ? 4 : 1,
              '&:hover': { boxShadow: 2 }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                  {deal.title}
                </MDTypography>
                <Chip
                  size="small"
                  label={priorityConfig.label}
                  sx={{
                    backgroundColor: priorityConfig.color,
                    color: 'white',
                    fontSize: '0.7rem',
                    height: '20px'
                  }}
                />
              </MDBox>
              
              <MDBox display="flex" alignItems="center" mb={1}>
                <DollarSign size={14} color="#1976d2" />
                <MDTypography variant="body2" fontWeight="bold" color="info" ml={0.5}>
                  ${(deal.value || 0).toLocaleString()}
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" mb={1}>
                <Building2 size={14} color="#666" />
                <MDTypography variant="caption" color="text" ml={0.5}>
                  {deal.firmName || 'No firm assigned'}
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" mb={1}>
                <User size={14} color="#666" />
                <MDTypography variant="caption" color="text" ml={0.5}>
                  {deal.contactName || 'No contact assigned'}
                </MDTypography>
              </MDBox>
              
              {deal.expectedCloseDate && (
                <MDBox display="flex" alignItems="center" mb={1}>
                  <Calendar size={14} color="#666" />
                  <MDTypography variant="caption" color="text" ml={0.5}>
                    Expected: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </MDTypography>
                </MDBox>
              )}
              
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <MDBox display="flex" gap={0.5}>
                  <IconButton size="small">
                    <Eye size={16} />
                  </IconButton>
                  <IconButton size="small">
                    <Edit size={16} />
                  </IconButton>
                  <IconButton size="small">
                    <Mail size={16} />
                  </IconButton>
                </MDBox>
                <LinearProgress
                  variant="determinate"
                  value={DEAL_STAGES.find(s => s.id === deal.currentStage)?.probability || 0}
                  sx={{ width: 60, height: 4, borderRadius: 2 }}
                />
              </MDBox>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

// Kanban column component
const KanbanColumn = ({ stage, deals }: { stage: any; deals: any[] }) => {
  return (
    <Card sx={{ minWidth: 280, maxWidth: 280, height: 'fit-content' }}>
      <CardHeader
        title={
          <MDBox>
            <MDTypography variant="subtitle1" fontWeight="bold" color="dark">
              {stage.name}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {deals.length} deals • {stage.probability}% avg probability
            </MDTypography>
          </MDBox>
        }
        action={
          <IconButton size="small">
            <Plus size={16} />
          </IconButton>
        }
        sx={{ 
          backgroundColor: stage.color,
          color: stage.textColor,
          pb: 1
        }}
      />
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <CardContent
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 400,
              maxHeight: 600,
              overflowY: 'auto',
              backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'transparent',
              transition: 'background-color 0.2s ease'
            }}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
};

// Table row component for Monday.com style view
const DealTableRow = ({ deal }: { deal: any }) => {
  const stage = DEAL_STAGES.find(s => s.id === deal.currentStage);
  const priorityConfig = PRIORITY_LEVELS.find(p => p.value === deal.priority) || PRIORITY_LEVELS[0];
  
  return (
    <TableRow hover>
      <TableCell>
        <MDBox display="flex" alignItems="center">
          <Chip
            size="small"
            label={priorityConfig.label}
            sx={{
              backgroundColor: priorityConfig.color,
              color: 'white',
              fontSize: '0.7rem',
              height: '20px',
              mr: 1
            }}
          />
          <MDTypography variant="body2" fontWeight="medium">
            {deal.title}
          </MDTypography>
        </MDBox>
      </TableCell>
      <TableCell>
        <Chip
          label={stage?.name || 'Unknown'}
          size="small"
          sx={{
            backgroundColor: stage?.color || '#f5f5f5',
            color: stage?.textColor || '#666'
          }}
        />
      </TableCell>
      <TableCell>
        <MDTypography variant="body2" fontWeight="bold" color="info">
          ${(deal.value || 0).toLocaleString()}
        </MDTypography>
      </TableCell>
      <TableCell>
        <MDTypography variant="body2">
          {deal.firmName || '-'}
        </MDTypography>
      </TableCell>
      <TableCell>
        <MDTypography variant="body2">
          {deal.contactName || '-'}
        </MDTypography>
      </TableCell>
      <TableCell>
        <LinearProgress
          variant="determinate"
          value={stage?.probability || 0}
          sx={{ height: 6, borderRadius: 3 }}
        />
        <MDTypography variant="caption" color="text">
          {stage?.probability || 0}%
        </MDTypography>
      </TableCell>
      <TableCell>
        <MDTypography variant="body2">
          {deal.expectedCloseDate 
            ? new Date(deal.expectedCloseDate).toLocaleDateString() 
            : '-'
          }
        </MDTypography>
      </TableCell>
      <TableCell>
        <MDBox display="flex" gap={0.5}>
          <IconButton size="small">
            <Eye size={16} />
          </IconButton>
          <IconButton size="small">
            <Edit size={16} />
          </IconButton>
          <IconButton size="small">
            <MoreVertical size={16} />
          </IconButton>
        </MDBox>
      </TableCell>
    </TableRow>
  );
};

const CRMPipelineDashboard = () => {
  const { isAuthenticated } = useAdminAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isFirmModalOpen, setIsFirmModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Data queries
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });
  const { data: contacts = [] } = useQuery({ queryKey: ['/api/contacts'] });
  const { data: firms = [] } = useQuery({ queryKey: ['/api/firms'] });

  // Type the data properly
  const typedDeals = deals as any[];
  const typedContacts = contacts as any[];
  const typedFirms = firms as any[];

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    return typedDeals.filter((deal: any) => {
      const matchesSearch = deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = selectedStage === 'all' || deal.currentStage === selectedStage;
      const matchesPriority = selectedPriority === 'all' || deal.priority === selectedPriority;
      
      return matchesSearch && matchesStage && matchesPriority;
    });
  }, [typedDeals, searchTerm, selectedStage, selectedPriority]);

  // Group deals by stage for Kanban view
  const groupedDeals = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    DEAL_STAGES.forEach(stage => {
      grouped[stage.id] = filteredDeals.filter((deal: any) => deal.currentStage === stage.id);
    });
    return grouped;
  }, [filteredDeals]);

  // Handle drag and drop for Kanban
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      await apiRequest('PATCH', `/api/deals/${draggableId}`, {
        currentStage: destination.droppableId
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Deal Updated",
        description: "Deal stage updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal stage",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return (
    <DashboardLayout>
      <MDBox p={3}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              Apple Bites CRM & Deal Pipeline
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Manage your M&A deal pipeline with advanced tracking and automation
            </MDTypography>
          </MDBox>
          
          {/* View Mode Toggle */}
          <MDBox display="flex" alignItems="center" gap={2}>
            <MDBox display="flex" sx={{ backgroundColor: '#f5f5f5', borderRadius: '6px', p: 0.5 }}>
              <MDButton
                variant={viewMode === 'kanban' ? 'contained' : 'text'}
                size="small"
                onClick={() => setViewMode('kanban')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <Grid3X3 size={16} style={{ marginRight: 4 }} />
                Kanban
              </MDButton>
              <MDButton
                variant={viewMode === 'table' ? 'contained' : 'text'}
                size="small"
                onClick={() => setViewMode('table')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <List size={16} style={{ marginRight: 4 }} />
                Table
              </MDButton>
            </MDBox>
            
            <MDButton
              variant="contained"
              color="primary"
              startIcon={<Plus size={16} />}
              onClick={() => setIsDealModalOpen(true)}
            >
              New Deal
            </MDButton>
            
            <MDButton
              variant="outlined"
              startIcon={<Mail size={16} />}
              onClick={() => setIsEmailModalOpen(true)}
            >
              Email Campaign
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Filters and Search */}
        <MDBox display="flex" gap={2} mb={3} flexWrap="wrap">
          <MDInput
            placeholder="Search deals, firms, contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Stage</InputLabel>
            <Select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              label="Stage"
            >
              <MenuItem value="all">All Stages</MenuItem>
              {DEAL_STAGES.map(stage => (
                <MenuItem key={stage.id} value={stage.id}>
                  {stage.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="all">All Priorities</MenuItem>
              {PRIORITY_LEVELS.map(priority => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>

        {/* Main Content */}
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <MDBox sx={{ overflowX: 'auto', pb: 2 }}>
              <MDBox display="flex" gap={2} sx={{ minWidth: 'fit-content' }}>
                {DEAL_STAGES.map(stage => (
                  <KanbanColumn
                    key={stage.id}
                    stage={stage}
                    deals={groupedDeals[stage.id] || []}
                  />
                ))}
              </MDBox>
            </MDBox>
          </DragDropContext>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deal</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Firm</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Expected Close</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals.map((deal: any) => (
                  <DealTableRow key={deal.id} deal={deal} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modals */}
        <ContactFormModal
          open={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          mode="create"
        />
        
        <DealFormModal
          open={isDealModalOpen}
          onClose={() => setIsDealModalOpen(false)}
          mode="create"
        />
        
        <FirmFormModal
          open={isFirmModalOpen}
          onClose={() => setIsFirmModalOpen(false)}
          mode="create"
        />
        
        <EmailCampaignModal
          open={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      </MDBox>
    </DashboardLayout>
  );
};

export default CRMPipelineDashboard;