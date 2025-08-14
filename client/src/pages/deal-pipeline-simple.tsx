import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  LinearProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  Button,
  Tabs,
  Tab,
  MenuItem
} from '@mui/material';

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Building2,
  Target as TargetIcon,
  User,
  Save,
  X
} from 'lucide-react';

import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';

// Deal validation schema
const dealFormSchema = z.object({
  dealName: z.string().min(1, "Deal name is required"),
  dealStage: z.string().min(1, "Deal stage is required"),
  dealSummary: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  clientFirmId: z.number().optional(),
  opportunityId: z.number().optional(),
  contactId: z.number().optional(),
  dealOwner: z.string().optional(),
  transactionType: z.string().optional(),
  estimatedTransactionValue: z.number().optional(),
  revenue: z.number().optional(),
  clientStage: z.string().optional(),
  clientIndustry: z.string().optional(),
  engagementStartDate: z.string().optional(),
  engagementEndDate: z.string().optional(),
  estimatedClosingDate: z.string().optional(),
  dealStatus: z.string().optional(),
  restricted: z.boolean().optional(),
  fees: z.string().optional(),
  probabilityOfClose: z.number().min(0).max(100).optional(),
  keyContacts: z.string().optional(),
  tags: z.string().optional(),
  referralInfo: z.string().optional(),
  referralContact: z.string().optional(),
  referralFirm: z.string().optional(),
  referralComments: z.string().optional(),
});

type DealFormData = z.infer<typeof dealFormSchema>;

// Deal stages configuration
const DEAL_STAGES = [
  { value: 'onboarding', label: 'Onboarding', color: '#e3f2fd' },
  { value: 'go_to_market_prep', label: 'Go To Market Prep', color: '#f3e5f5' },
  { value: 'go_to_market', label: 'Go To Market', color: '#e8f5e8' },
  { value: 'negotiations', label: 'Negotiations', color: '#fff3e0' },
  { value: 'due_diligence', label: 'Due Diligence', color: '#e8eaf6' },
  { value: 'definitive_agreement_close', label: 'Definitive Agreement/Close', color: '#f9fbe7' },
  { value: 'post_close', label: 'Post Close', color: '#e8f5e8' }
];

// Transaction types
const TRANSACTION_TYPES = [
  { value: 'sell_side', label: 'Sell-Side M&A' },
  { value: 'buy_side', label: 'Buy-Side M&A' },
  { value: 'capital_raise', label: 'Capital Raise' },
  { value: 'strategic_advisory', label: 'Strategic Advisory' },
  { value: 'valuation', label: 'Valuation Services' },
  { value: 'due_diligence', label: 'Due Diligence' },
  { value: 'restructuring', label: 'Restructuring' },
  { value: 'joint_venture', label: 'Joint Venture' },
  { value: 'other', label: 'Other' }
];

// Client stages
const CLIENT_STAGES = [
  { value: 'startup', label: 'Startup' },
  { value: 'early_stage', label: 'Early Stage' },
  { value: 'growth', label: 'Growth' },
  { value: 'mature', label: 'Mature' },
  { value: 'distressed', label: 'Distressed' },
  { value: 'turnaround', label: 'Turnaround' }
];

// Industries
const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'energy', label: 'Energy' },
  { value: 'consumer_goods', label: 'Consumer Goods' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'construction', label: 'Construction' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' }
];

// Deal statuses
const DEAL_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Deal form modal component
interface DealFormModalProps {
  open: boolean;
  onClose: () => void;
  deal?: any;
  firms?: any[];
  contacts?: any[];
  opportunities?: any[];
}

function DealFormModal({ open, onClose, deal, firms = [], contacts = [], opportunities = [] }: DealFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<DealFormData>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: deal ? {
      dealName: deal.dealName || '',
      dealStage: deal.dealStage || 'onboarding',
      dealSummary: deal.dealSummary || '',
      description: deal.description || '',
      notes: deal.notes || '',
      clientFirmId: deal.clientFirmId || undefined,
      opportunityId: deal.opportunityId || undefined,
      contactId: deal.contactId || undefined,
      dealOwner: deal.dealOwner || '',
      transactionType: deal.transactionType || '',
      estimatedTransactionValue: deal.estimatedTransactionValue || undefined,
      revenue: deal.revenue || undefined,
      clientStage: deal.clientStage || '',
      clientIndustry: deal.clientIndustry || '',
      engagementStartDate: deal.engagementStartDate ? new Date(deal.engagementStartDate).toISOString().split('T')[0] : '',
      engagementEndDate: deal.engagementEndDate ? new Date(deal.engagementEndDate).toISOString().split('T')[0] : '',
      estimatedClosingDate: deal.estimatedClosingDate ? new Date(deal.estimatedClosingDate).toISOString().split('T')[0] : '',
      dealStatus: deal.dealStatus || 'active',
      restricted: deal.restricted || false,
      fees: deal.fees || '',
      probabilityOfClose: deal.probabilityOfClose || 0,
      keyContacts: deal.keyContacts || '',
      tags: deal.tags || '',
      referralInfo: deal.referralInfo || '',
      referralContact: deal.referralContact || '',
      referralFirm: deal.referralFirm || '',
      referralComments: deal.referralComments || '',
    } : {
      dealName: '',
      dealStage: 'onboarding',
      dealStatus: 'active',
      restricted: false,
      probabilityOfClose: 0,
    }
  });

  const saveDealMutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      const url = deal ? `/api/deals/${deal.id}` : '/api/deals';
      const method = deal ? 'PATCH' : 'POST';
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Success",
        description: `Deal ${deal ? 'updated' : 'created'} successfully`,
      });
      onClose();
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${deal ? 'update' : 'create'} deal`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: DealFormData) => {
    saveDealMutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setCurrentTab(0);
    onClose();
  };

  const tabLabels = ['Basic Info', 'Transaction Details', 'Timeline & Progress', 'Referral Info'];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {deal ? 'Edit Deal' : 'Create New Deal'}
          </Typography>
          <IconButton onClick={handleClose}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab 0: Basic Information */}
          {currentTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="dealName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Deal Name *"
                    fullWidth
                    error={!!errors.dealName}
                    helperText={errors.dealName?.message}
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="dealStage"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Deal Stage *</InputLabel>
                      <Select {...field} label="Deal Stage *">
                        {DEAL_STAGES.map((stage) => (
                          <MenuItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="dealStatus"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Deal Status</InputLabel>
                      <Select {...field} label="Deal Status">
                        {DEAL_STATUSES.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="clientFirmId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      options={firms}
                      getOptionLabel={(option) => option.firmName || ''}
                      value={firms.find(f => f.id === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.id)}
                      renderInput={(params) => (
                        <TextField {...params} label="Client Firm" />
                      )}
                    />
                  )}
                />

                <Controller
                  name="contactId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      options={contacts}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
                      value={contacts.find(c => c.id === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.id)}
                      renderInput={(params) => (
                        <TextField {...params} label="Primary Contact" />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="opportunityId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      options={opportunities}
                      getOptionLabel={(option) => option.summary || ''}
                      value={opportunities.find(o => o.id === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.id)}
                      renderInput={(params) => (
                        <TextField {...params} label="Related Opportunity" />
                      )}
                    />
                  )}
                />

                <Controller
                  name="dealOwner"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Deal Owner"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Controller
                name="dealSummary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Deal Summary"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Internal Notes"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tags (comma-separated)"
                    fullWidth
                    placeholder="e.g., high-priority, tech-sector, strategic"
                  />
                )}
              />

              <Controller
                name="restricted"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value || false}
                        onChange={field.onChange}
                      />
                    }
                    label="Restricted Deal"
                  />
                )}
              />
            </Box>
          )}

          {/* Tab 1: Transaction Details */}
          {currentTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="transactionType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Transaction Type</InputLabel>
                      <Select {...field} label="Transaction Type">
                        {TRANSACTION_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="clientIndustry"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Client Industry</InputLabel>
                      <Select {...field} label="Client Industry">
                        {INDUSTRIES.map((industry) => (
                          <MenuItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="clientStage"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Client Stage</InputLabel>
                      <Select {...field} label="Client Stage">
                        {CLIENT_STAGES.map((stage) => (
                          <MenuItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="estimatedTransactionValue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Estimated Transaction Value ($)"
                      fullWidth
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="revenue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Annual Revenue ($)"
                      fullWidth
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name="fees"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fee Structure"
                      fullWidth
                      placeholder="e.g., Success fee: 2%, Retainer: $50k"
                    />
                  )}
                />
              </Box>

              <Controller
                name="keyContacts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Key Contacts"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="List other important contacts involved in this deal"
                  />
                )}
              />
            </Box>
          )}

          {/* Tab 2: Timeline & Progress */}
          {currentTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="engagementStartDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Engagement Start Date"
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />

                <Controller
                  name="engagementEndDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Engagement End Date"
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="estimatedClosingDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Estimated Closing Date"
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />

                <Controller
                  name="probabilityOfClose"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Probability of Close (%)"
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Probability Visualization
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={watch('probabilityOfClose') || 0} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {watch('probabilityOfClose') || 0}% complete
                </Typography>
              </Box>
            </Box>
          )}

          {/* Tab 3: Referral Information */}
          {currentTab === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="referralContact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Referral Contact"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="referralFirm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Referral Firm"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Controller
                name="referralInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Referral Information"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="How did this deal come to us? Referral details..."
                  />
                )}
              />

              <Controller
                name="referralComments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Referral Comments"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Additional comments about the referral..."
                  />
                )}
              />
            </Box>
          )}
        </form>
      </DialogContent>

      <DialogActions>
        <Box display="flex" justifyContent="space-between" width="100%" px={2} py={1}>
          <Box>
            {currentTab > 0 && (
              <Button onClick={() => setCurrentTab(currentTab - 1)}>
                Previous
              </Button>
            )}
          </Box>
          <Box>
            {currentTab < tabLabels.length - 1 ? (
              <Button variant="contained" onClick={() => setCurrentTab(currentTab + 1)}>
                Next
              </Button>
            ) : (
              <Box>
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  disabled={saveDealMutation.isPending}
                  startIcon={<Save size={16} />}
                >
                  {saveDealMutation.isPending ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

// Main Deal Pipeline component
export default function DealPipelineSimple() {
  const { isAuthenticated } = useAdminAuth();
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all deals
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
    enabled: isAuthenticated
  });

  // Fetch firms for the form
  const { data: firms = [] } = useQuery({
    queryKey: ['/api/firms'],
    enabled: isAuthenticated
  });

  // Fetch contacts for the form
  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    enabled: isAuthenticated
  });

  // Fetch opportunities for the form
  const { data: opportunities = [] } = useQuery({
    queryKey: ['/api/opportunities'],
    enabled: isAuthenticated
  });

  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: number) => {
      return apiRequest('DELETE', `/api/deals/${dealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Success",
        description: "Deal deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive",
      });
    }
  });

  // Filter deals based on search and stage
  const filteredDeals = useMemo(() => {
    return (deals as any[]).filter((deal: any) => {
      const matchesSearch = deal.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.dealSummary?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = !stageFilter || deal.dealStage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, stageFilter]);

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal);
    setDealFormOpen(true);
  };

  const handleDeleteDeal = (dealId: number) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      deleteDealMutation.mutate(dealId);
    }
  };

  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setDealFormOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageInfo = (stage: string) => {
    return DEAL_STAGES.find(s => s.value === stage) || { label: stage, color: '#f5f5f5' };
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return (
    <DashboardLayout>
      <MDBox py={3}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Deal Pipeline
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Comprehensive M&A deal management and tracking
            </MDTypography>
          </MDBox>
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<Plus size={20} />}
            onClick={handleCreateDeal}
          >
            New Deal
          </MDButton>
        </MDBox>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                sx={{ minWidth: 300 }}
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />,
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Stage</InputLabel>
                <Select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  label="Filter by Stage"
                >
                  <MenuItem value="">All Stages</MenuItem>
                  {DEAL_STAGES.map((stage) => (
                    <MenuItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary">
                {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Deals Table */}
        <Card>
          <CardContent>
            {dealsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <MDTypography variant="body2">Loading deals...</MDTypography>
              </Box>
            ) : filteredDeals.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                <TargetIcon size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                <MDTypography variant="h6" color="text" mb={1}>
                  No deals found
                </MDTypography>
                <MDTypography variant="body2" color="text" textAlign="center">
                  {searchTerm || stageFilter ? 'Try adjusting your filters' : 'Create your first deal to get started'}
                </MDTypography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deal Name</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Client Firm</TableCell>
                      <TableCell>Transaction Value</TableCell>
                      <TableCell>Probability</TableCell>
                      <TableCell>Close Date</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDeals.map((deal: any) => {
                      const stageInfo = getStageInfo(deal.dealStage);
                      const firm = (firms as any[]).find((f: any) => f.id === deal.clientFirmId);
                      
                      return (
                        <TableRow key={deal.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {deal.dealName}
                              </Typography>
                              {deal.dealSummary && (
                                <Typography variant="caption" color="textSecondary">
                                  {deal.dealSummary.length > 50 
                                    ? `${deal.dealSummary.substring(0, 50)}...` 
                                    : deal.dealSummary}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={stageInfo.label}
                              size="small"
                              style={{
                                backgroundColor: stageInfo.color,
                                color: '#333'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {firm ? (
                              <Box display="flex" alignItems="center">
                                <Building2 size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2">
                                  {firm.firmName}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Not assigned
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {deal.estimatedTransactionValue ? (
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(deal.estimatedTransactionValue)}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Not specified
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Box width="60px" mr={1}>
                                <LinearProgress
                                  variant="determinate"
                                  value={deal.probabilityOfClose || 0}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="caption">
                                {deal.probabilityOfClose || 0}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {deal.estimatedClosingDate ? (
                              <Typography variant="body2">
                                {new Date(deal.estimatedClosingDate).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Not set
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {deal.dealOwner ? (
                              <Box display="flex" alignItems="center">
                                <User size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2">
                                  {deal.dealOwner}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Unassigned
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex">
                              <Tooltip title="Edit deal">
                                <IconButton size="small" onClick={() => handleEditDeal(deal)}>
                                  <Edit size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete deal">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  disabled={deleteDealMutation.isPending}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Deal Form Modal */}
        <DealFormModal
          open={dealFormOpen}
          onClose={() => setDealFormOpen(false)}
          deal={selectedDeal}
          firms={firms as any[]}
          contacts={contacts as any[]}
          opportunities={opportunities as any[]}
        />
      </MDBox>
    </DashboardLayout>
  );
}