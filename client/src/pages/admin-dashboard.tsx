import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Users, Plus, Edit, Trash2, Shield, LogOut, UserPlus, Settings, Home, BarChart3, Calendar, FileText, User, Menu, Clock, Crown, TrendingUp, Mail, Phone, Building, Eye, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamMemberSchema, type InsertTeamMember, type TeamMember } from '@shared/schema';
// Admin dashboard - authentication handled by AdminLoginPage
import { useToast } from '@/hooks/use-toast';

// Material Dashboard Components
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { Avatar } from '@mui/material';
import MDInput from '@/components/MD/MDInput';
import { Card, CardContent, Container, Box, Button, Typography, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { Grid } from '@mui/system';

const appleBitesLogoPath = '/assets/logos/apple-bites-meritage-logo.png';

// Admin Sidebar Component - Exact copy from user dashboard structure
function AdminSidebar({ user, onSignOut, activeTab, setActiveTab }: { user: any; onSignOut: () => void; activeTab: string; setActiveTab: (tab: string) => void }) {
  // Apple Bites Brand Colors - Exact copy from user dashboard
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC",
    gray: "#CBD5E1"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00718d 0%, #005b8c 100%)",
    dark: "linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierGradient = (role: string) => {
    switch (role) {
      case 'admin': return gradients.primary;
      case 'manager': return gradients.light;
      default: return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
    }
  };

  const getTierLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      default: return 'Member';
    }
  };

  return (
    <MDBox
      sx={{
        // Desktop: Fixed sidebar
        position: { xs: 'relative', md: 'fixed' },
        top: { xs: 0, md: '24px' },
        left: { xs: 0, md: '24px' },
        width: { xs: '100%', md: 280 },
        height: { xs: 'auto', md: 'calc(100vh - 48px)' },
        background: gradients.dark,
        borderRadius: { xs: '0', md: '20px' },
        border: { xs: 'none', md: `1px solid rgba(255, 255, 255, 0.15)` },
        boxShadow: { xs: 'none', md: '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' },
        backdropFilter: 'blur(8px)',
        padding: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden', // Prevent internal scrolling
        mb: { xs: 2, md: 0 }, // Add margin bottom on mobile
      }}
    >
      {/* User Info Section */}
      <MDBox mb={4}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              background: gradients.glow,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <User size={24} color="white" />
          </Avatar>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
              {user?.firstName} {user?.lastName}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              {user?.email}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
            Role:
          </MDTypography>
          <MDBox
            sx={{
              background: getTierGradient(user?.role || 'admin'),
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {getTierLabel(user?.role || 'admin')}
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Navigation Buttons - Exact structure from user dashboard */}
      <MDBox display="flex" flexDirection="column" gap={1.5}>
        <MDButton
          onClick={() => setActiveTab('overview')}
          sx={{
            background: activeTab === 'overview' ? gradients.glow : 'transparent',
            border: activeTab === 'overview' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'overview' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'overview' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<Home size={18} />}
        >
          Dashboard Overview
        </MDButton>

        <MDButton
          onClick={() => setActiveTab('team')}
          sx={{
            background: activeTab === 'team' ? gradients.glow : 'transparent',
            border: activeTab === 'team' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'team' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'team' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<Users size={18} />}
        >
          Team Members
        </MDButton>

        <MDButton
          onClick={() => setActiveTab('leads')}
          sx={{
            background: activeTab === 'leads' ? gradients.glow : 'transparent',
            border: activeTab === 'leads' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'leads' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'leads' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<FileText size={18} />}
        >
          Leads
        </MDButton>



        <MDButton
          onClick={() => setActiveTab('analytics')}
          sx={{
            background: activeTab === 'analytics' ? gradients.glow : 'transparent',
            border: activeTab === 'analytics' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'analytics' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'analytics' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<BarChart3 size={18} />}
        >
          Analytics
        </MDButton>

        <MDButton
          onClick={onSignOut}
          className="text-[#dbdce1]"
          sx={{
            background: 'transparent',
            border: `1px solid #EF4444`,
            color: '#EF4444',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#DC2626',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<LogOut size={18} />}
        >
          Sign Out
        </MDButton>
      </MDBox>

      {/* Spacer */}
      <MDBox flexGrow={1} />

      {/* Footer - Exact copy from user dashboard */}
      <MDBox mt={4} pt={2} borderTop={`1px solid rgba(255, 255, 255, 0.2)`}>
        <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites by Meritage Partners"
            width={250}
            height={250}
            style={{
              objectFit: 'contain',
              maxWidth: '100%'
            }}
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Stats Card Component
function StatsCard({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
}) {
  const getGradient = (color: string) => {
    const gradients = {
      primary: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
      success: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    };
    return gradients[color as keyof typeof gradients] || gradients.primary;
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 2 }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#344767', mb: 0.5 }}>
              {value}
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e', mb: 0.25, fontSize: '0.9rem' }}>
              {title}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: '#67748e', fontSize: '0.75rem' }}>
              {subtitle}
            </MDTypography>
          </MDBox>
          <MDBox
            sx={{
              background: getGradient(color),
              borderRadius: '8px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px'
            }}
          >
            <Icon size={18} color="white" />
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  // Admin dashboard doesn't use team authentication
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState('overview'); // Internal navigation state
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Admin user object for display
  const adminUser = {
    firstName: 'Daniel',
    lastName: 'Robosky',
    email: 'drobosky@meritage-partners.com',
    role: 'admin'
  };

  // Admin logout function
  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/admin';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/admin';
    }
  };

  const { data: teamMembers, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
    enabled: true, // Admin dashboard assumes proper authentication
  });

  const form = useForm<InsertTeamMember>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'member',
      password: '',
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setIsAddModalOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Team member created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Success',
        description: 'Team member deleted successfully',
      });
    },
  });

  // Show authentication loading state
  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <MDTypography variant="h6">Loading...</MDTypography>
      </MDBox>
    );
  }

  // Show login screen if not authenticated
  // Admin dashboard assumes authentication is handled by AdminLoginPage
  // No fallback login form needed here

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'error',
      'manager': 'info', 
      'member': 'success',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  const onSubmit = (data: InsertTeamMember) => {
    createMemberMutation.mutate(data);
  };



  return (
    <MDBox sx={{ 
      display: { xs: 'block', md: 'flex' }, 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa' 
    }}>
      <AdminSidebar user={adminUser} onSignOut={handleAdminLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <MDBox
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: '328px' }, // No margin on mobile, fixed margin on desktop
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          width: { xs: '100%', md: 'calc(100% - 328px)' }, // Full width on mobile
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 1 }}>
                {activeTab === 'team' && 'Team Management'}
                {activeTab === 'leads' && 'Lead Management'}
                {activeTab === 'analytics' && 'Analytics Dashboard'}
                {activeTab === 'overview' && 'Admin Dashboard'}
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: '#67748e' }}>
                Welcome back, {adminUser?.firstName} {adminUser?.lastName} - {activeTab === 'team' && 'Manage your team and organization'}
                {activeTab === 'leads' && 'Track and manage leads'}
                {activeTab === 'analytics' && 'View system analytics'}
                {activeTab === 'overview' && 'Overview of all system metrics'}
              </MDTypography>
            </MDBox>
            <MDBox display="flex" gap={2}>
              <MDButton
                variant="outlined"
                color="info"
                onClick={handleAdminLogout}
                startIcon={<LogOut size={18} />}
              >
                Logout
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'team' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatsCard
                  title="Total Members"
                  value={teamMembers?.length || 0}
                  subtitle="registered accounts"
                  icon={Users}
                  color="primary"
                />
                <StatsCard
                  title="Active Members"
                  value={teamMembers?.filter(m => m.isActive).length || 0}
                  subtitle="currently active"
                  icon={Shield}
                  color="success"
                />
                <StatsCard
                  title="Admins"
                  value={teamMembers?.filter(m => m.role === 'admin').length || 0}
                  subtitle="with admin access"
                  icon={Settings}
                  color="info"
                />
                <StatsCard
                  title="Managers"
                  value={teamMembers?.filter(m => m.role === 'manager').length || 0}
                  subtitle="team managers"
                  icon={UserPlus}
                  color="warning"
                />
              </div>

              {/* Team Members Table */}
          <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
            <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767' }}>
                Team Members
              </MDTypography>
              <MDButton
                variant="contained"
                color="info"
                onClick={() => setIsAddModalOpen(true)}
                startIcon={<Plus size={18} />}
              >
                Add Member
              </MDButton>
            </MDBox>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Role</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {member.firstName} {member.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#67748e' }}>
                          {member.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.role.toUpperCase()} 
                          color={getRoleColor(member.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.isActive ? 'Active' : 'Inactive'}
                          color={member.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditingMember(member)}
                          sx={{ color: '#67748e' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteMemberMutation.mutate(member.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Add Member Modal */}
          <Modal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            aria-labelledby="add-member-title"
            BackdropProps={{
              style: { 
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)'
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
                p: 4,
                border: '1px solid #e0e0e0',
                outline: 'none',
                opacity: 1,
                zIndex: 1300,
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#344767' }}>
                Add Team Member
              </MDTypography>
              
              <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      {...form.register('firstName')}
                      error={!!form.formState.errors.firstName}
                      helperText={form.formState.errors.firstName?.message}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      {...form.register('lastName')}
                      error={!!form.formState.errors.lastName}
                      helperText={form.formState.errors.lastName?.message}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...form.register('email')}
                    error={!!form.formState.errors.email}
                    helperText={form.formState.errors.email?.message}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...form.register('password')}
                    error={!!form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    {...form.register('role')}
                    SelectProps={{ native: true }}
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </TextField>
                </Box>
                
                <MDBox mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <MDButton 
                    variant="outlined" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </MDButton>
                  <MDButton 
                    variant="contained" 
                    color="info" 
                    type="submit"
                    disabled={createMemberMutation.isPending}
                  >
                    {createMemberMutation.isPending ? 'Creating...' : 'Create Member'}
                  </MDButton>
                </MDBox>
              </Box>
            </Box>
          </Modal>
          </>
          )}

          {/* Overview Dashboard Tab */}
          {activeTab === 'overview' && (
            <OverviewDashboard teamMembers={teamMembers} />
          )}

          {/* Leads Dashboard Tab */}
          {activeTab === 'leads' && (
            <LeadsManagement />
          )}

          {/* Analytics Dashboard Tab */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

        </Container>
      </MDBox>
    </MDBox>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ teamMembers }: { teamMembers?: TeamMember[] }) {
  const { data: leads } = useQuery<any[]>({
    queryKey: ['/api/leads'],
    enabled: true,
  });

  return (
    <>
      {/* System Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatsCard
          title="Total Team Members"
          value={teamMembers?.length || 0}
          subtitle="registered users"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Total Leads"
          value={leads?.length || 0}
          subtitle="in system"
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="Active Members"
          value={teamMembers?.filter(m => m.isActive).length || 0}
          subtitle="currently active"
          icon={Shield}
          color="info"
        />
        <StatsCard
          title="System Health"
          value="Online"
          subtitle="all systems operational"
          icon={Settings}
          color="warning"
        />
      </div>

      {/* Recent Activity */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)', mb: 3 }}>
        <MDBox p={2.5}>
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767', mb: 2 }}>
            System Overview
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Welcome to the Apple Bites admin dashboard. From here you can manage your team, track leads, and view system analytics.
          </MDTypography>
        </MDBox>
      </Card>
    </>
  );
}

// Leads Management Component
function LeadsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('leads'); // 'leads' or 'assessments'

  const { data: leads, isLoading: leadsLoading } = useQuery<any[]>({
    queryKey: ['/api/leads', statusFilter === 'all' ? '' : statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    enabled: true,
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery<any[]>({
    queryKey: ['/api/assessments'],
    queryFn: async () => {
      const response = await fetch('/api/assessments');
      if (!response.ok) throw new Error('Failed to fetch assessments');
      return response.json();
    },
    enabled: true,
  });

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'capital': return 'error';
      case 'growth': return 'warning';
      case 'free': return 'info';
      default: return 'default';
    }
  };

  const getScoreColor = (score: string) => {
    if (!score) return 'default';
    const grade = score.charAt(0);
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D':
      case 'F': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)', mb: 3 }}>
        <MDBox p={2.5}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <MDButton
                variant={viewMode === 'leads' ? 'contained' : 'outlined'}
                color="info"
                size="small"
                onClick={() => setViewMode('leads')}
                startIcon={<Users size={16} />}
              >
                Leads
              </MDButton>
              <MDButton
                variant={viewMode === 'assessments' ? 'contained' : 'outlined'}
                color="info"
                size="small"
                onClick={() => setViewMode('assessments')}
                startIcon={<TrendingUp size={16} />}
              >
                Assessments
              </MDButton>
            </div>
            <TextField
              label={viewMode === 'leads' ? 'Search leads...' : 'Search assessments...'}
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: '300px' }}
            />
            {viewMode === 'leads' && (
              <TextField
                select
                label="Status"
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ minWidth: '150px' }}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="closed">Closed</option>
              </TextField>
            )}
          </div>
        </MDBox>
      </Card>

      {/* Dynamic Table Based on View Mode */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767' }}>
            {viewMode === 'leads' ? `Leads (${leads?.length || 0})` : `Assessments (${assessments?.length || 0})`}
          </MDTypography>
        </MDBox>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                {viewMode === 'leads' ? (
                  <>
                    <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Company</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell><Typography fontWeight="bold">Business</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Valuation</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Score</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Tier</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {viewMode === 'leads' ? (
                // Leads View
                <>
                  {leads?.map((lead, index) => (
                    <TableRow key={lead.id || index}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={16} />
                          {`${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} />
                          {lead.email || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={16} />
                          {lead.phone || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building size={16} />
                          {lead.company || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.status || 'new'} 
                          size="small"
                          color={lead.status === 'qualified' ? 'success' : lead.status === 'closed' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={16} />
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!leads || leads.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                        <MDTypography variant="body2" sx={{ color: '#67748e' }}>
                          No leads found
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                // Assessments View
                <>
                  {assessmentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography>Loading assessments...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : assessments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="textSecondary">No assessments found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assessments
                      ?.filter(assessment => {
                        if (!searchQuery) return true;
                        return `${assessment.firstName} ${assessment.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               assessment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               assessment.email.toLowerCase().includes(searchQuery.toLowerCase());
                      })
                      ?.map((assessment, index) => (
                        <TableRow key={assessment.id || index}>
                          <TableCell>
                            <MDBox>
                              <Typography variant="body2" fontWeight="medium">
                                {assessment.company}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#67748e' }}>
                                {assessment.industryDescription || 'Business Assessment'}
                              </Typography>
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox>
                              <Typography variant="body2" fontWeight="medium">
                                {assessment.firstName} {assessment.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#67748e' }}>
                                {assessment.email}
                              </Typography>
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox>
                              <Typography variant="body2" fontWeight="medium" sx={{ color: '#2E7D3A' }}>
                                {formatCurrency(assessment.midEstimate || 0)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#67748e' }}>
                                {formatCurrency(assessment.lowEstimate || 0)} - {formatCurrency(assessment.highEstimate || 0)}
                              </Typography>
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={assessment.overallScore || 'N/A'} 
                              color={getScoreColor(assessment.overallScore || '') as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={assessment.tier?.toUpperCase() || 'FREE'} 
                              color={getTierColor(assessment.tier || 'free') as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#67748e' }}>
                              {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              {assessment.pdfUrl && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => window.open(assessment.pdfUrl, '_blank')}
                                  sx={{ color: '#2E7D3A' }}
                                  title="View PDF Report"
                                >
                                  <Eye size={16} />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small" 
                                onClick={() => window.open(`/assessment/${assessment.id}`, '_blank')}
                                sx={{ color: '#1976d2' }}
                                title="View Full Assessment"
                              >
                                <ExternalLink size={16} />
                              </IconButton>
                            </MDBox>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

// Analytics Dashboard Component  
function AnalyticsDashboard() {
  const { data: analytics } = useQuery<any>({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: true,
  });

  return (
    <>
      {/* Analytics Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatsCard
          title="Total Assessments"
          value={analytics?.totalAssessments || 0}
          subtitle="completed"
          icon={FileText}
          color="primary"
        />
        <StatsCard
          title="Active Users"
          value={analytics?.activeUsers || 0}
          subtitle="this month"
          icon={Users}
          color="success"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analytics?.conversionRate || 0}%`}
          subtitle="lead to customer"
          icon={TrendingUp}
          color="info"
        />
        <StatsCard
          title="Revenue"
          value={`$${analytics?.revenue || 0}`}
          subtitle="this month"
          icon={BarChart3}
          color="warning"
        />
      </div>

      {/* Analytics Content */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <MDBox p={2.5}>
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767', mb: 2 }}>
            System Analytics
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Detailed analytics dashboard coming soon. This will include charts, metrics, and reporting functionality.
          </MDTypography>
        </MDBox>
      </Card>
    </>
  );
}