import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import { 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
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
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';

import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  ArrowLeft, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Plus,
  Filter,
  Download,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

import { apiRequest } from '@/lib/queryClient';
import type { Lead } from '@shared/schema';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function CRMDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch leads data
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads', statusFilter === 'all' ? '' : statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Show login if not authenticated
  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <MDBox textAlign="center">
          <MDBox 
            width={40} 
            height={40} 
            mx="auto" 
            mb={2}
            sx={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #00718d',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <MDTypography variant="body2" color="text">
            Loading CRM Dashboard...
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  // CRM Statistics Cards
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.leadStatus === 'qualified').length;
  const convertedLeads = leads.filter(lead => lead.leadStatus === 'converted').length;
  const avgLeadScore = leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / leads.length) : 0;

  const StatsCard = ({ icon: Icon, title, value, color, subtitle }: any) => (
    <Card sx={{ height: '100%', boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 0.5 }}>
              {value}
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e', mb: 0.5 }}>
              {title}
            </MDTypography>
            {subtitle && (
              <MDTypography variant="caption" sx={{ color: '#8392AB' }}>
                {subtitle}
              </MDTypography>
            )}
          </MDBox>
          <MDBox
            sx={{
              backgroundColor: color,
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={24} color="white" />
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#6B7280';
      case 'contacted': return '#3B82F6';
      case 'qualified': return '#F59E0B';
      case 'converted': return '#10B981';
      case 'closed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock;
      case 'contacted': return User;
      case 'qualified': return CheckCircle;
      case 'converted': return TrendingUp;
      case 'closed': return XCircle;
      default: return AlertCircle;
    }
  };

  const LeadsTable = () => (
    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#F8F9FA' }}>
          <TableRow>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Contact</MDTypography></TableCell>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Company</MDTypography></TableCell>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Status</MDTypography></TableCell>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Score</MDTypography></TableCell>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Value</MDTypography></TableCell>
            <TableCell><MDTypography variant="caption" fontWeight="bold" color="text">Actions</MDTypography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => {
            const StatusIcon = getStatusIcon(lead.leadStatus || 'new');
            return (
              <TableRow key={lead.id} hover>
                <TableCell>
                  <MDBox display="flex" alignItems="center">
                    <MDBox>
                      <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#344767' }}>
                        {lead.firstName} {lead.lastName}
                      </MDTypography>
                      <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                        {lead.email}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </TableCell>
                <TableCell>
                  <MDTypography variant="body2" sx={{ color: '#344767' }}>
                    {lead.company}
                  </MDTypography>
                  <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                    {lead.jobTitle}
                  </MDTypography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<StatusIcon size={14} />}
                    label={lead.leadStatus || 'new'}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(lead.leadStatus || 'new'),
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <MDTypography variant="body2" sx={{ color: '#344767' }}>
                    {lead.leadScore || 0}/100
                  </MDTypography>
                </TableCell>
                <TableCell>
                  <MDTypography variant="body2" sx={{ color: '#344767' }}>
                    {lead.estimatedValue ? `$${Number(lead.estimatedValue).toLocaleString()}` : '-'}
                  </MDTypography>
                </TableCell>
                <TableCell>
                  <MDBox display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Lead">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                  </MDBox>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MDBox p={3} sx={{ backgroundColor: '#F7FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 1 }}>
            CRM Dashboard
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Manage leads, deals, and customer relationships
          </MDTypography>
        </MDBox>
        <MDBox display="flex" gap={2}>
          <MDButton
            variant="outlined"
            color="info"
            startIcon={<Download size={16} />}
          >
            Export
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<Plus size={16} />}
          >
            Add Lead
          </MDButton>
          <MDButton
            variant="outlined"
            color="secondary"
            startIcon={<LogOut size={16} />}
            onClick={logout}
          >
            Logout
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={Users}
            title="Total Leads"
            value={totalLeads}
            color="#00718d"
            subtitle={`${leads.filter(l => l.createdAt && new Date(l.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={CheckCircle}
            title="Qualified Leads"
            value={qualifiedLeads}
            color="#10B981"
            subtitle={`${Math.round((qualifiedLeads / totalLeads) * 100) || 0}% qualification rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={TrendingUp}
            title="Converted"
            value={convertedLeads}
            color="#F59E0B"
            subtitle={`${Math.round((convertedLeads / totalLeads) * 100) || 0}% conversion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={BarChart3}
            title="Avg Score"
            value={avgLeadScore}
            color="#8B5CF6"
            subtitle="Lead quality score"
          />
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={20} style={{ marginRight: 8, color: '#67748e' }} />
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="qualified">Qualified</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <MDBox display="flex" justifyContent="flex-end" gap={1}>
                <MDButton
                  variant="outlined"
                  color="info"
                  size="small"
                  startIcon={<Filter size={16} />}
                >
                  More Filters
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <MDBox p={2.5} borderBottom="1px solid #E9ECEF">
            <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767' }}>
              Leads Pipeline ({totalLeads} total)
            </MDTypography>
          </MDBox>
          {leadsLoading ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" p={4}>
              <MDBox textAlign="center">
                <MDBox 
                  width={40} 
                  height={40} 
                  mx="auto" 
                  mb={2}
                  sx={{ 
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #00718d',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                />
                <MDTypography variant="body2" color="text">
                  Loading leads...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : leads.length === 0 ? (
            <MDBox textAlign="center" p={6}>
              <Users size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
              <MDTypography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                No leads found
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: '#94A3B8' }}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Leads will appear here once customers complete assessments'
                }
              </MDTypography>
            </MDBox>
          ) : (
            <LeadsTable />
          )}
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      <Dialog 
        open={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDTypography variant="h5" fontWeight="bold">
            Lead Details
          </MDTypography>
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    Contact Information
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Name:</strong> {selectedLead.firstName} {selectedLead.lastName}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Email:</strong> {selectedLead.email}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Phone:</strong> {selectedLead.phone || 'Not provided'}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Company:</strong> {selectedLead.company}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Job Title:</strong> {selectedLead.jobTitle || 'Not provided'}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    Lead Information
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Status:</strong> 
                    <Chip
                      label={selectedLead.leadStatus || 'new'}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: getStatusColor(selectedLead.leadStatus || 'new'),
                        color: 'white',
                        textTransform: 'capitalize'
                      }}
                    />
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Score:</strong> {selectedLead.leadScore || 0}/100
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Source:</strong> {selectedLead.leadSource || 'Unknown'}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Estimated Value:</strong> {selectedLead.estimatedValue ? `$${Number(selectedLead.estimatedValue).toLocaleString()}` : 'Not available'}
                  </MDTypography>
                </MDBox>
                <MDBox mb={1}>
                  <MDTypography variant="body2" color="text">
                    <strong>Follow-up Intent:</strong> {selectedLead.followUpIntent || 'Unknown'}
                  </MDTypography>
                </MDBox>
              </Grid>
              {selectedLead.notes && (
                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Notes
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="text">
                    {selectedLead.notes}
                  </MDTypography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton variant="outlined" onClick={() => setShowDetailsModal(false)}>
            Close
          </MDButton>
          <MDButton 
            variant="gradient" 
            color="info"
            onClick={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
          >
            Edit Lead
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}