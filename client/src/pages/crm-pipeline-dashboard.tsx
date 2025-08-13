import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Box,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Typography,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText
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
  Activity
} from 'lucide-react';

import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';

import type { 
  Contact, 
  Firm, 
  Opportunity, 
  Deal, 
  Target, 
  InsertContact,
  InsertFirm,
  InsertOpportunity,
  InsertDeal,
  InsertTarget
} from '@shared/schema';

// 14-Stage Deal Pipeline Constants
const DEAL_STAGES = [
  { id: 'prospect_identified', name: 'Prospect Identified', color: '#e3f2fd' },
  { id: 'initial_contact', name: 'Initial Contact', color: '#f3e5f5' },
  { id: 'qualification', name: 'Qualification', color: '#e8f5e8' },
  { id: 'needs_analysis', name: 'Needs Analysis', color: '#fff3e0' },
  { id: 'proposal_preparation', name: 'Proposal Preparation', color: '#fce4ec' },
  { id: 'proposal_presented', name: 'Proposal Presented', color: '#e0f2f1' },
  { id: 'negotiation', name: 'Negotiation', color: '#f1f8e9' },
  { id: 'contract_review', name: 'Contract Review', color: '#e8eaf6' },
  { id: 'due_diligence', name: 'Due Diligence', color: '#fdf6e3' },
  { id: 'closing_preparation', name: 'Closing Preparation', color: '#e4f3ff' },
  { id: 'closed_won', name: 'Closed Won', color: '#e8f5e8' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ffebee' },
  { id: 'on_hold', name: 'On Hold', color: '#f5f5f5' },
  { id: 'follow_up', name: 'Follow Up', color: '#fff8e1' }
];

const TRANSACTION_TYPES = [
  'M&A - Buy Side',
  'M&A - Sell Side',
  'Capital Raise',
  'Strategic Advisory',
  'Valuation',
  'Due Diligence',
  'Business Sale',
  'Asset Purchase',
  'Merger',
  'Joint Venture'
];

const CLIENT_STAGES = [
  'Early Stage',
  'Growth Stage',
  'Mature',
  'Distressed',
  'Turnaround',
  'Exit Ready'
];

export default function CRMPipelineDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [modalEntity, setModalEntity] = useState<'contact' | 'firm' | 'opportunity' | 'deal' | 'target'>('contact');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Queries for all CRM entities
  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    enabled: isAuthenticated
  });

  const { data: firms = [] } = useQuery<Firm[]>({
    queryKey: ['/api/firms'],
    enabled: isAuthenticated
  });

  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ['/api/opportunities'],
    enabled: isAuthenticated
  });

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
    enabled: isAuthenticated
  });

  const { data: targets = [] } = useQuery<Target[]>({
    queryKey: ['/api/targets'],
    enabled: isAuthenticated
  });

  // Mutation for updating deal stages
  const updateDealMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Deal> }) => {
      return apiRequest('PATCH', `/api/deals/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive",
      });
    }
  });

  // Generic create/update mutations
  const createMutation = useMutation({
    mutationFn: async ({ entity, data }: { entity: string; data: any }) => {
      return apiRequest('POST', `/api/${entity}`, data);
    },
    onSuccess: (_, { entity }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
      setShowModal(false);
      toast({
        title: "Success",
        description: `${entity.slice(0, -1)} created successfully`,
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ entity, id, data }: { entity: string; id: number; data: any }) => {
      return apiRequest('PATCH', `/api/${entity}/${id}`, data);
    },
    onSuccess: (_, { entity }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
      setShowModal(false);
      toast({
        title: "Success",
        description: `${entity.slice(0, -1)} updated successfully`,
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ entity, id }: { entity: string; id: number }) => {
      return apiRequest('DELETE', `/api/${entity}/${id}`);
    },
    onSuccess: (_, { entity }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
      toast({
        title: "Success",
        description: `${entity.slice(0, -1)} deleted successfully`,
      });
    }
  });

  // Handle drag and drop for deal pipeline
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const dealId = parseInt(result.draggableId);
    const newStage = result.destination.droppableId;
    
    updateDealMutation.mutate({
      id: dealId,
      updates: { dealStage: newStage }
    });
  };

  // Filter deals by stage for pipeline view
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    
    DEAL_STAGES.forEach(stage => {
      grouped[stage.id] = deals.filter((deal: Deal) => deal.dealStage === stage.id);
    });
    
    return grouped;
  }, [deals]);

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum: number, deal: Deal) => 
      sum + (parseFloat(deal.estimatedTransactionValue || '0')), 0);
    const avgProbability = deals.length > 0 
      ? deals.reduce((sum: number, deal: Deal) => sum + (deal.probabilityOfClose || 0), 0) / deals.length 
      : 0;

    const stageDistribution = DEAL_STAGES.map(stage => ({
      stage: stage.name,
      count: dealsByStage[stage.id]?.length || 0,
      value: dealsByStage[stage.id]?.reduce((sum: number, deal: Deal) => 
        sum + (parseFloat(deal.estimatedTransactionValue || '0')), 0) || 0
    }));

    return {
      totalContacts: contacts.length,
      totalFirms: firms.length,
      totalOpportunities: opportunities.length,
      totalDeals,
      totalValue,
      avgProbability,
      stageDistribution
    };
  }, [contacts, firms, opportunities, deals, dealsByStage]);

  if (isLoading) {
    return (
      <MDBox p={3}>
        <MDTypography variant="h6">Loading CRM Dashboard...</MDTypography>
      </MDBox>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  // Tab content renderers
  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Statistics Cards */}
      <Grid xs={12} md={3}>
        <Card>
          <CardContent>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold">
                  {statistics.totalContacts}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Total Contacts
                </MDTypography>
              </MDBox>
              <Users size={32} color="#1976d2" />
            </MDBox>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid xs={12} md={3}>
        <Card>
          <CardContent>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold">
                  {statistics.totalFirms}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Total Firms
                </MDTypography>
              </MDBox>
              <Building2 size={32} color="#2e7d32" />
            </MDBox>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={3}>
        <Card>
          <CardContent>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold">
                  {statistics.totalDeals}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Active Deals
                </MDTypography>
              </MDBox>
              <TrendingUp size={32} color="#ed6c02" />
            </MDBox>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={3}>
        <Card>
          <CardContent>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold">
                  ${(statistics.totalValue / 1000000).toFixed(1)}M
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Pipeline Value
                </MDTypography>
              </MDBox>
              <DollarSign size={32} color="#9c27b0" />
            </MDBox>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid xs={12}>
        <Card>
          <CardHeader title="Recent Activity" />
          <CardContent>
            <MDTypography variant="body2" color="text">
              Recent CRM activities will appear here...
            </MDTypography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPipeline = () => (
    <MDBox>
      <MDBox display="flex" justifyContent="between" alignItems="center" mb={3}>
        <MDTypography variant="h5" fontWeight="bold">
          Deal Pipeline - 14 Stage Process
        </MDTypography>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setModalType('create');
            setModalEntity('deal');
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          &nbsp;New Deal
        </MDButton>
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
                        borderRadius="8px"
                        p={1}
                      >
                        {(dealsByStage[stage.id] || []).map((deal, index) => (
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
                                    <MDTypography variant="caption" fontWeight="bold">
                                      ${(parseFloat(deal.estimatedTransactionValue || '0') / 1000).toFixed(0)}K
                                    </MDTypography>
                                  </MDBox>
                                  <MDBox display="flex" justifyContent="end" mt={1}>
                                    <IconButton 
                                      size="small"
                                      onClick={() => {
                                        setSelectedEntity(deal);
                                        setModalType('view');
                                        setModalEntity('deal');
                                        setShowModal(true);
                                      }}
                                    >
                                      <Eye size={16} />
                                    </IconButton>
                                  </MDBox>
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
    </MDBox>
  );

  const renderContacts = () => (
    <MDBox>
      <MDBox display="flex" justifyContent="between" alignItems="center" mb={3}>
        <MDTypography variant="h5" fontWeight="bold">
          Contact Management
        </MDTypography>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setModalType('create');
            setModalEntity('contact');
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          &nbsp;New Contact
        </MDButton>
      </MDBox>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Firm</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact: Contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <MDBox>
                    <MDTypography variant="subtitle2" fontWeight="bold">
                      {contact.firstName} {contact.lastName}
                    </MDTypography>
                    {contact.goesByName && (
                      <MDTypography variant="caption" color="text">
                        ({contact.goesByName})
                      </MDTypography>
                    )}
                  </MDBox>
                </TableCell>
                <TableCell>{contact.title || '—'}</TableCell>
                <TableCell>{contact.email || '—'}</TableCell>
                <TableCell>{contact.phoneMobile || contact.phoneOffice || '—'}</TableCell>
                <TableCell>
                  {contact.firmId ? `Firm #${contact.firmId}` : '—'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedEntity(contact);
                      setModalType('view');
                      setModalEntity('contact');
                      setShowModal(true);
                    }}
                  >
                    <Eye size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedEntity(contact);
                      setModalType('edit');
                      setModalEntity('contact');
                      setShowModal(true);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MDBox>
  );

  const renderFirms = () => (
    <MDBox>
      <MDBox display="flex" justifyContent="between" alignItems="center" mb={3}>
        <MDTypography variant="h5" fontWeight="bold">
          Firm Management
        </MDTypography>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setModalType('create');
            setModalEntity('firm');
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          &nbsp;New Firm
        </MDButton>
      </MDBox>

      <Grid container spacing={3}>
        {firms.map((firm: Firm) => (
          <Grid xs={12} md={6} lg={4} key={firm.id}>
            <Card>
              <CardContent>
                <MDBox display="flex" justifyContent="between" alignItems="start" mb={2}>
                  <MDBox>
                    <MDTypography variant="h6" fontWeight="bold">
                      {firm.firmName}
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      {firm.industry || 'Industry not specified'}
                    </MDTypography>
                  </MDBox>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedEntity(firm);
                      setModalType('view');
                      setModalEntity('firm');
                      setShowModal(true);
                    }}
                  >
                    <Eye size={16} />
                  </IconButton>
                </MDBox>

                <MDBox mb={2}>
                  <MDTypography variant="body2">
                    📍 {firm.city}, {firm.stateRegion}
                  </MDTypography>
                  {firm.websiteUrl && (
                    <MDTypography variant="body2">
                      🌐 <a href={firm.websiteUrl} target="_blank" rel="noopener noreferrer">
                        {firm.websiteUrl}
                      </a>
                    </MDTypography>
                  )}
                </MDBox>

                {(firm.annualRevenue || firm.annualEbitda) && (
                  <MDBox>
                    {firm.annualRevenue && (
                      <Chip 
                        label={`Revenue: $${(parseFloat(firm.annualRevenue) / 1000000).toFixed(1)}M`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    {firm.annualEbitda && (
                      <Chip 
                        label={`EBITDA: $${(parseFloat(firm.annualEbitda) / 1000000).toFixed(1)}M`}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </MDBox>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );

  return (
    <MDBox p={3}>
      <MDBox mb={3}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Apple Bites CRM & Deal Pipeline
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Comprehensive M&A Deal Management System
        </MDTypography>
      </MDBox>

      <Card>
        <MDBox p={0}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Deal Pipeline" />
            <Tab label="Contacts" />
            <Tab label="Firms" />
            <Tab label="Opportunities" />
            <Tab label="Targets" />
          </Tabs>
        </MDBox>

        <MDBox p={3}>
          {activeTab === 0 && renderOverview()}
          {activeTab === 1 && renderPipeline()}
          {activeTab === 2 && renderContacts()}
          {activeTab === 3 && renderFirms()}
          {activeTab === 4 && (
            <MDTypography variant="h6">
              Opportunities management coming soon...
            </MDTypography>
          )}
          {activeTab === 5 && (
            <MDTypography variant="h6">
              Targets management coming soon...
            </MDTypography>
          )}
        </MDBox>
      </Card>

      {/* Create/Edit Modal - Basic placeholder for now */}
      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalType === 'create' ? 'Create' : modalType === 'edit' ? 'Edit' : 'View'} {modalEntity}
        </DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            {modalType} {modalEntity} form will be implemented here...
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Close</Button>
          {modalType !== 'view' && (
            <Button variant="contained">Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}