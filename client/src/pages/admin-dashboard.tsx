import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Users, Plus, Edit, Trash2, Shield, LogOut, UserPlus, Settings, Home, BarChart3, Calendar, FileText, User, Menu } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamMemberSchema, type InsertTeamMember, type TeamMember } from '@shared/schema';
import TeamLogin from '@/components/team-login';
import { useTeamAuth } from '@/hooks/use-team-auth';
import { useToast } from '@/hooks/use-toast';

// Material Dashboard Components
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import { Card, CardContent, Grid, Container, Box, Button, Typography, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';

const appleBitesLogoPath = '/assets/logos/apple-bites-meritage-logo.png';

// Sidebar Component matching main dashboard
function AdminSidebar() {
  const [, setLocation] = useLocation();
  
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Team Members', href: '/admin/team' },
    { icon: FileText, label: 'Leads', href: '/admin/leads' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <MDBox
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 100 0 L 0 0 0 100" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E")',
          opacity: 0.3
        }
      }}
    >
      {/* Logo Section */}
      <MDBox sx={{ p: 3, textAlign: 'center', zIndex: 1 }}>
        <Box
          component="img"
          src={appleBitesLogoPath}
          alt="Apple Bites"
          sx={{
            height: 80,
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        />
        <MDTypography variant="h6" sx={{ color: 'white', mt: 2, fontWeight: 'bold' }}>
          Admin Dashboard
        </MDTypography>
      </MDBox>

      {/* Navigation Items */}
      <MDBox sx={{ flex: 1, px: 2, zIndex: 1 }}>
        {sidebarItems.map((item, index) => (
          <MDBox
            key={index}
            onClick={() => setLocation(item.href)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              mb: 1,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <item.icon size={20} color="white" />
            <MDTypography variant="body2" sx={{ color: 'white', ml: 2, fontWeight: 'medium' }}>
              {item.label}
            </MDTypography>
          </MDBox>
        ))}
      </MDBox>

      {/* Footer */}
      <MDBox sx={{ p: 3, zIndex: 1 }}>
        <MDTypography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
          © 2025 Meritage Partners
        </MDTypography>
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
      primary: 'linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)',
      success: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    };
    return gradients[color as keyof typeof gradients] || gradients.primary;
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.15)' }}>
      <CardContent sx={{ p: 3 }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 1 }}>
              {value}
            </MDTypography>
            <MDTypography variant="h6" sx={{ color: '#67748e', mb: 0.5 }}>
              {title}
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e' }}>
              {subtitle}
            </MDTypography>
          </MDBox>
          <MDBox
            sx={{
              background: getGradient(color),
              borderRadius: '12px',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              minHeight: '48px'
            }}
          >
            <Icon size={24} color="white" />
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, hasRole, logout } = useTeamAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: teamMembers, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
    enabled: isAuthenticated && hasRole('admin'),
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
  if (!isAuthenticated) {
    return <TeamLogin onLoginSuccess={(userData) => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    }} />;
  }

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
    <MDBox sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AdminSidebar />
      
      {/* Main Content */}
      <MDBox
        sx={{
          flex: 1,
          marginLeft: '280px',
          p: 4,
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <MDBox mb={4} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 1 }}>
                Team Management
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: '#67748e' }}>
                Welcome back, {user?.firstName} {user?.lastName} - Manage your team and organization
              </MDTypography>
            </MDBox>
            <MDBox display="flex" gap={2}>
              <MDButton
                variant="outlined"
                color="info"
                onClick={logout}
                startIcon={<LogOut size={18} />}
              >
                Logout
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Members"
                value={teamMembers?.length || 0}
                subtitle="registered accounts"
                icon={Users}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Active Members"
                value={teamMembers?.filter(m => m.isActive).length || 0}
                subtitle="currently active"
                icon={Shield}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Admins"
                value={teamMembers?.filter(m => m.role === 'admin').length || 0}
                subtitle="with admin access"
                icon={Settings}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Managers"
                value={teamMembers?.filter(m => m.role === 'manager').length || 0}
                subtitle="team managers"
                icon={UserPlus}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Team Members Table */}
          <Card sx={{ boxShadow: '0 4px 20px -8px rgba(0,0,0,0.15)' }}>
            <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
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
          >
            <MDBox
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#344767' }}>
                Add Team Member
              </MDTypography>
              
              <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...form.register('firstName')}
                      error={!!form.formState.errors.firstName}
                      helperText={form.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...form.register('lastName')}
                      error={!!form.formState.errors.lastName}
                      helperText={form.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      {...form.register('email')}
                      error={!!form.formState.errors.email}
                      helperText={form.formState.errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      {...form.register('password')}
                      error={!!form.formState.errors.password}
                      helperText={form.formState.errors.password?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
                
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
            </MDBox>
          </Modal>
        </Container>
      </MDBox>
    </MDBox>
  );
}