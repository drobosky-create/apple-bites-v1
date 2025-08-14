import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  PendingActions as PendingActionsIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedMaterialDashboardLayout } from '@/components/layout/EnhancedMaterialDashboardLayout';
import MaterialDashboardCard from '@/components/dashboard/MaterialDashboardCard';

interface DashboardMetrics {
  totalAssessments: number;
  activeLeads: number;
  totalDeals: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgDealSize: number;
}

interface RecentActivity {
  id: string;
  type: 'assessment' | 'lead' | 'deal';
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
  value?: number;
}

export default function EnhancedDashboard() {
  const { user } = useAuth();

  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    // Mock data for now - replace with real API
    initialData: {
      totalAssessments: 847,
      activeLeads: 23,
      totalDeals: 12,
      monthlyRevenue: 285000,
      conversionRate: 68,
      avgDealSize: 950000
    }
  });

  const { data: recentActivity = [] } = useQuery<RecentActivity[]>({
    queryKey: ['/api/dashboard/recent-activity'],
    // Mock data for now - replace with real API
    initialData: [
      {
        id: '1',
        type: 'assessment',
        title: 'TechStart Solutions Assessment',
        subtitle: 'Strategic growth assessment completed',
        timestamp: '2 hours ago',
        status: 'completed',
        value: 2400000
      },
      {
        id: '2',
        type: 'lead',
        title: 'Manufacturing Corp Lead',
        subtitle: 'Initial contact established',
        timestamp: '4 hours ago',
        status: 'in_progress'
      },
      {
        id: '3',
        type: 'deal',
        title: 'Healthcare Systems M&A',
        subtitle: 'Due diligence phase',
        timestamp: '1 day ago',
        status: 'in_progress',
        value: 15000000
      },
      {
        id: '4',
        type: 'assessment',
        title: 'RetailMax Valuation',
        subtitle: 'Awaiting client response',
        timestamp: '2 days ago',
        status: 'pending'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <AssessmentIcon />;
      case 'lead': return <PeopleIcon />;
      case 'deal': return <BusinessIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <EnhancedMaterialDashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: '#344767', fontWeight: 'bold' }}>
          M&A Business Dashboard
        </Typography>

        {/* Win The Storm Event Banner */}
        <Paper sx={{ mb: 4, p: 3, background: 'linear-gradient(195deg, #f0f8ff, #e1f0ff)', border: 'none', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(195deg, #005b8c, #004662)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0, 91, 140, 0.3)'
              }}>
                <StarIcon sx={{ color: '#ffffff', fontSize: '1.75rem' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0b2147', mb: 0.5 }}>
                  Win The Storm Event Ready
                </Typography>
                <Typography variant="body2" sx={{ color: '#344767', maxWidth: '500px' }}>
                  Your comprehensive M&A platform is ready for presentation. All deal pipeline and CRM features are fully operational.
                </Typography>
              </Box>
            </Box>
            <Box
              component="a"
              href="/admin/deal-pipeline"
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(195deg, #16A34A, #15803D)',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(22, 163, 74, 0.4)'
                }
              }}
            >
              <BusinessIcon sx={{ fontSize: '1rem', color: '#ffffff' }} />
              View Deal Pipeline
            </Box>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Total Assessments"
              count={metrics?.totalAssessments || 0}
              icon={<AssessmentIcon />}
              color="success"
              percentage={{
                amount: "+15%",
                color: "success",
                label: "than last month"
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Active Leads"
              count={metrics?.activeLeads || 0}
              icon={<PeopleIcon />}
              color="info"
              percentage={{
                amount: "+8%",
                color: "success",
                label: "than last month"
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Active Deals"
              count={metrics?.totalDeals || 0}
              icon={<BusinessIcon />}
              color="warning"
              percentage={{
                amount: "+3",
                color: "success",
                label: "new this month"
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Monthly Revenue"
              count={formatCurrency(metrics?.monthlyRevenue || 0)}
              icon={<AccountBalanceIcon />}
              color="primary"
              percentage={{
                amount: "+22%",
                color: "success",
                label: "than last month"
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Conversion Rate"
              count={`${metrics?.conversionRate || 0}%`}
              icon={<TrendingUpIcon />}
              color="error"
              percentage={{
                amount: "+5%",
                color: "success",
                label: "improvement"
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
            <MaterialDashboardCard
              title="Avg Deal Size"
              count={formatCurrency(metrics?.avgDealSize || 0)}
              icon={<CheckCircleIcon />}
              color="dark"
              percentage={{
                amount: "+12%",
                color: "success",
                label: "than last quarter"
              }}
            />
          </Box>
        </Box>

        {/* Performance Overview and Recent Activity */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '2 1 600px', minWidth: '400px' }}>
            <Card
              sx={{
                height: 400,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: 3,
                border: 'none'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: '#344767',
                    fontSize: '1.25rem'
                  }}
                >
                  Deal Pipeline Overview
                </Typography>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  color: 'text.secondary',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '2px dashed #e9ecef'
                }}>
                  <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    Deal pipeline analytics and charts will be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card
              sx={{
                height: 400,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: 3,
                border: 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: '#344767',
                    fontSize: '1.25rem'
                  }}
                >
                  Recent Activity
                </Typography>
                <List sx={{ p: 0 }}>
                  {recentActivity.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        mb: 2,
                        border: '1px solid #e9ecef',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        '&:hover': {
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            background: 'linear-gradient(195deg, #005b8c, #004662)',
                            width: 45,
                            height: 45,
                            '& svg': {
                              color: '#ffffff'
                            }
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#344767',
                              fontSize: '0.9rem'
                            }}
                          >
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem', mb: 0.5 }}
                            >
                              {activity.subtitle}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={activity.status.replace('_', ' ')}
                                color={getStatusColor(activity.status) as any}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                  textTransform: 'capitalize'
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.7rem' }}
                              >
                                {activity.timestamp}
                              </Typography>
                            </Box>
                            {activity.value && (
                              <Typography
                                variant="body2"
                                sx={{ 
                                  fontWeight: 700, 
                                  color: '#16A34A',
                                  fontSize: '0.8rem',
                                  mt: 0.5
                                }}
                              >
                                {formatCurrency(activity.value)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <IconButton
                        size="small"
                        sx={{
                          color: '#344767',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 91, 140, 0.1)'
                          }
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </EnhancedMaterialDashboardLayout>
  );
}