import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid } from '@mui/material';
import { useLocation } from 'wouter';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  Clock,
  Award,
  AlertTriangle,
  Calendar,
  Activity,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

const ExecutiveDashboard = () => {
  const [, setLocation] = useLocation();
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });
  const { data: contacts = [] } = useQuery({ queryKey: ['/api/contacts'] });
  const { data: firms = [] } = useQuery({ queryKey: ['/api/firms'] });

  // Type the data properly
  const typedDeals = deals as any[];
  const typedContacts = contacts as any[];
  const typedFirms = firms as any[];

  // Calculate real metrics
  const totalPipelineValue = typedDeals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
  const activeDeals = typedDeals.filter((deal: any) => !['closed_won', 'closed_lost', 'closed_hold'].includes(deal.currentStage));
  const wonDeals = typedDeals.filter((deal: any) => deal.currentStage === 'closed_won');
  const lostDeals = typedDeals.filter((deal: any) => deal.currentStage === 'closed_lost');
  const winRate = typedDeals.length > 0 ? ((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;
  
  // Calculate average deal cycle (mock calculation based on stages)
  const avgDealCycle = activeDeals.length > 0 ? 45 : 0; // days
  
  const kpiCards = [
    {
      title: 'Total Pipeline Value',
      value: `$${(totalPipelineValue / 1000000).toFixed(1)}M`,
      subtitle: `${activeDeals.length} active deals`,
      icon: DollarSign,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
      change: '+12.5%',
      changeColor: '#059669'
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      subtitle: `${wonDeals.length} won, ${lostDeals.length} lost`,
      icon: Target,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      change: '+3.2%',
      changeColor: '#059669'
    },
    {
      title: 'Avg Deal Cycle',
      value: `${avgDealCycle} days`,
      subtitle: 'Time to close',
      icon: Clock,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      change: '-5 days',
      changeColor: '#059669'
    },
    {
      title: 'Active Relationships',
      value: typedContacts.length + typedFirms.length,
      subtitle: `${typedContacts.length} contacts, ${typedFirms.length} firms`,
      icon: Users,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      change: '+8.1%',
      changeColor: '#059669'
    }
  ];



  return (
    <MDBox p={3} sx={{ width: '100%', maxWidth: 'none', minWidth: 0, overflow: 'hidden' }}>
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Executive Dashboard
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Real-time M&A pipeline performance and key metrics
        </MDTypography>
      </MDBox>

      {/* Top Row: 4 Uniform KPI Cards */}
      <MDBox mb={4}>
        <Grid container spacing={4}>
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Grid key={index} size={3}>
              <Card sx={{ height: '140px', width: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" width="100%" height="100%">
                    <MDBox flex={1} textAlign="left">
                      <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" mb={1} display="block">
                        {kpi.title}
                      </MDTypography>
                      <MDTypography variant="h4" fontWeight="bold" color="dark" mb={0.5} display="block">
                        {kpi.value}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" mb={1} display="block">
                        {kpi.subtitle}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" justifyContent="flex-start">
                        <MDTypography variant="caption" sx={{ color: kpi.changeColor }} fontWeight="bold">
                          {kpi.change}
                        </MDTypography>
                        <MDTypography variant="caption" color="text" ml={0.5}>
                          vs last month
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox 
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        backgroundColor: kpi.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        ml: 2
                      }}
                    >
                      <IconComponent size={28} color={kpi.color} />
                    </MDBox>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        </Grid>
      </MDBox>

      {/* Middle Row: 3 Uniform Sections */}
      <MDBox mb={4}>
        <Grid container spacing={4}>
          {/* Pipeline Health */}
          <Grid size={4}>
            <Card sx={{ height: '500px', width: '100%' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#3B82F6" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Pipeline Health
                </MDTypography>
              </MDBox>
              
              <MDBox mb={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="body2" color="text">Early Stage</MDTypography>
                  <MDTypography variant="body2" fontWeight="bold">
                    {typedDeals.filter(d => ['prospect', 'initial', 'qualification'].includes(d.currentStage)).length}
                  </MDTypography>
                </MDBox>
                <MDBox sx={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
                  <MDBox 
                    sx={{ 
                      width: `${typedDeals.length > 0 ? (typedDeals.filter(d => ['prospect', 'initial', 'qualification'].includes(d.currentStage)).length / typedDeals.length) * 100 : 0}%`,
                      height: '100%', 
                      backgroundColor: '#93C5FD', 
                      borderRadius: 3 
                    }} 
                  />
                </MDBox>
              </MDBox>

              <MDBox mb={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="body2" color="text">Mid Stage</MDTypography>
                  <MDTypography variant="body2" fontWeight="bold">
                    {typedDeals.filter(d => ['needs', 'proposal_prep', 'proposal_presented', 'negotiation'].includes(d.currentStage)).length}
                  </MDTypography>
                </MDBox>
                <MDBox sx={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
                  <MDBox 
                    sx={{ 
                      width: `${typedDeals.length > 0 ? (typedDeals.filter(d => ['needs', 'proposal_prep', 'proposal_presented', 'negotiation'].includes(d.currentStage)).length / typedDeals.length) * 100 : 0}%`,
                      height: '100%', 
                      backgroundColor: '#3B82F6', 
                      borderRadius: 3 
                    }} 
                  />
                </MDBox>
              </MDBox>

              <MDBox mb={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="body2" color="text">Late Stage</MDTypography>
                  <MDTypography variant="body2" fontWeight="bold">
                    {typedDeals.filter(d => ['contract', 'due_diligence', 'closing'].includes(d.currentStage)).length}
                  </MDTypography>
                </MDBox>
                <MDBox sx={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
                  <MDBox 
                    sx={{ 
                      width: `${typedDeals.length > 0 ? (typedDeals.filter(d => ['contract', 'due_diligence', 'closing'].includes(d.currentStage)).length / typedDeals.length) * 100 : 0}%`,
                      height: '100%', 
                      backgroundColor: '#1E40AF', 
                      borderRadius: 3 
                    }} 
                  />
                </MDBox>
              </MDBox>

              <MDBox mt={3} pt={2} sx={{ borderTop: '1px solid #E5E7EB' }}>
                <MDTypography variant="body2" color="text" fontWeight="bold" mb={2}>
                  Revenue Forecast
                </MDTypography>
                
                <MDBox mb={2}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <MDTypography variant="caption" color="text">Next 30 Days</MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="success">
                      ${((totalPipelineValue * 0.3) / 1000000).toFixed(1)}M
                    </MDTypography>
                  </MDBox>
                  <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                    <MDBox sx={{ width: '65%', height: '100%', backgroundColor: '#059669', borderRadius: 2 }} />
                  </MDBox>
                </MDBox>

                <MDBox mb={2}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <MDTypography variant="caption" color="text">Next 90 Days</MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="info">
                      ${((totalPipelineValue * 0.6) / 1000000).toFixed(1)}M
                    </MDTypography>
                  </MDBox>
                  <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                    <MDBox sx={{ width: '85%', height: '100%', backgroundColor: '#3B82F6', borderRadius: 2 }} />
                  </MDBox>
                </MDBox>

                <MDBox>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <MDTypography variant="caption" color="text">Confidence Level</MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="warning">
                      78% High
                    </MDTypography>
                  </MDBox>
                  <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                    <MDBox sx={{ width: '78%', height: '100%', backgroundColor: '#F59E0B', borderRadius: 2 }} />
                  </MDBox>
                </MDBox>
              </MDBox>
            </CardContent>
          </Card>
          </Grid>

          {/* Recent Activity Feed */}
          <Grid size={4}>
            <Card sx={{ height: '500px', width: '100%' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Activity size={20} color="#059669" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Recent Activity
                </MDTypography>
              </MDBox>
              
              <MDBox sx={{ maxHeight: '420px', overflowY: 'auto' }}>
                {[
                  { type: 'deal_update', title: 'TechCorp acquisition moved to Due Diligence', time: '2 hours ago', icon: TrendingUp, value: '$8.5M' },
                  { type: 'meeting', title: 'Call scheduled with RetailPlus CFO', time: '4 hours ago', icon: Phone, value: '$2.1M' },
                  { type: 'email', title: 'Proposal sent to Manufacturing Inc.', time: '6 hours ago', icon: Mail, value: '$5.2M' },
                  { type: 'win', title: 'HealthTech deal closed - Won!', time: '1 day ago', icon: Award, value: '$2.5M' },
                  { type: 'meeting', title: 'Site visit completed at GlobalTech', time: '2 days ago', icon: Building2, value: '$12.3M' },
                  { type: 'email', title: 'LOI signed with DataCorp', time: '3 days ago', icon: Mail, value: '$7.8M' },
                  { type: 'call', title: 'Management presentation to InvestorGroup', time: '4 days ago', icon: Phone, value: '$15.6M' },
                  { type: 'document', title: 'Financial audit completed for CleanEnergy', time: '5 days ago', icon: FileText, value: '$4.2M' }
                ].map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <MDBox key={index} display="flex" alignItems="flex-start" mb={2} p={1.5} sx={{ backgroundColor: index % 2 === 0 ? '#F8FAFC' : 'transparent', borderRadius: '8px' }}>
                      <MDBox 
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          backgroundColor: activity.type === 'win' ? '#DCFCE7' : '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0
                        }}
                      >
                        <IconComponent size={16} color={activity.type === 'win' ? '#16A34A' : '#6B7280'} />
                      </MDBox>
                      <MDBox flex={1}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                          <MDBox>
                            <MDTypography variant="body2" fontWeight="medium" color="dark">
                              {activity.title}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              {activity.time}
                            </MDTypography>
                          </MDBox>
                          <MDTypography variant="caption" fontWeight="bold" color={activity.type === 'win' ? 'success' : 'info'}>
                            {activity.value}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  );
                })}
              </MDBox>
            </CardContent>
          </Card>
          </Grid>

          {/* Priority Dashboard */}
          <Grid size={4}>
            <Card sx={{ height: '500px', width: '100%' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <MDBox display="flex" alignItems="center">
                  <AlertTriangle size={20} color="#F59E0B" />
                  <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                    Priority Dashboard
                  </MDTypography>
                </MDBox>
                <MDButton 
                  size="small" 
                  variant="text" 
                  sx={{ color: '#3B82F6', minWidth: 'auto', p: 0.5 }}
                  onClick={() => setLocation('/admin/crm-pipeline')}
                >
                  Manage
                </MDButton>
              </MDBox>
              
              <MDBox sx={{ maxHeight: '420px', overflowY: 'auto' }}>
                {/* Urgent Tasks Section */}
                <MDTypography variant="subtitle2" fontWeight="bold" color="dark" mb={2}>
                  Urgent Tasks (4)
                </MDTypography>
                {[
                  { task: 'Follow up on GlobalTech proposal response', deadline: 'Today', priority: 'high', deal: '$12.3M' },
                  { task: 'Prepare due diligence materials for TechCorp', deadline: 'Tomorrow', priority: 'high', deal: '$8.5M' },
                  { task: 'Schedule investor meeting for RetailPlus', deadline: '2 days', priority: 'medium', deal: '$2.1M' },
                  { task: 'Review legal documents for FinanceFirst', deadline: '3 days', priority: 'medium', deal: '$6.7M' },
                ].map((task, index) => (
                  <MDBox 
                    key={index} 
                    p={2} 
                    mb={1} 
                    sx={{ 
                      backgroundColor: task.priority === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(107, 114, 128, 0.05)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${task.priority === 'high' ? '#EF4444' : '#6B7280'}`
                    }}
                  >
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDTypography variant="body2" fontWeight="medium" color="dark">
                        {task.task}
                      </MDTypography>
                      <MDTypography variant="caption" fontWeight="bold" color="info">
                        {task.deal}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" justifyContent="space-between">
                      <MDTypography variant="caption" color="text">
                        Due: {task.deadline}
                      </MDTypography>
                      <MDBox 
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: '4px',
                          backgroundColor: task.priority === 'high' ? '#FEF2F2' : '#F9FAFB',
                          border: `1px solid ${task.priority === 'high' ? '#FECACA' : '#E5E7EB'}`
                        }}
                      >
                        <MDTypography 
                          variant="caption" 
                          sx={{ color: task.priority === 'high' ? '#DC2626' : '#6B7280' }}
                          fontWeight="medium"
                          textTransform="uppercase"
                        >
                          {task.priority}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                ))}

                {/* Performance Metrics Section */}
                <MDBox mt={3} pt={2} sx={{ borderTop: '1px solid #E5E7EB' }}>
                  <MDTypography variant="subtitle2" fontWeight="bold" color="dark" mb={2}>
                    This Month Performance
                  </MDTypography>
                  
                  <MDBox mb={2}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="caption" color="text">Deals Closed</MDTypography>
                      <MDTypography variant="body2" fontWeight="bold" color="success">3 deals</MDTypography>
                    </MDBox>
                    <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                      <MDBox sx={{ width: '75%', height: '100%', backgroundColor: '#059669', borderRadius: 2 }} />
                    </MDBox>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="caption" color="text">Revenue Generated</MDTypography>
                      <MDTypography variant="body2" fontWeight="bold" color="success">$8.2M</MDTypography>
                    </MDBox>
                    <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                      <MDBox sx={{ width: '82%', height: '100%', backgroundColor: '#059669', borderRadius: 2 }} />
                    </MDBox>
                  </MDBox>

                  <MDBox>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="caption" color="text">Pipeline Velocity</MDTypography>
                      <MDTypography variant="body2" fontWeight="bold" color="info">+15%</MDTypography>
                    </MDBox>
                    <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                      <MDBox sx={{ width: '90%', height: '100%', backgroundColor: '#3B82F6', borderRadius: 2 }} />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Bottom Row: 2 Sections */}
      <MDBox>
        <Grid container spacing={4}>
          {/* Market Intelligence */}
          <Grid size={6}>
            <Card sx={{ height: '350px', width: '100%' }}>
            <CardContent sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Target size={20} color="#8B5CF6" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Market Intelligence
                </MDTypography>
              </MDBox>
              
              <Grid container spacing={1.5} sx={{ flex: 1 }}>
                <Grid size={6}>
                  <MDBox p={1.5} sx={{ backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                    <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" sx={{ fontSize: '0.65rem' }}>
                      Industry Multiples
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold" color="dark" sx={{ fontSize: '1.1rem' }}>
                      4.2x - 7.8x
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                      EBITDA range
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid size={6}>
                  <MDBox p={1.5} sx={{ backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                    <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" sx={{ fontSize: '0.65rem' }}>
                      Market Activity
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold" color="success" sx={{ fontSize: '1.1rem' }}>
                      +23%
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                      vs last quarter
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid size={12}>
                  <MDBox mt={0.5}>
                    <MDTypography variant="body2" fontWeight="bold" color="dark" mb={0.5} sx={{ fontSize: '0.8rem' }}>
                      Hot Sectors This Quarter
                    </MDTypography>
                    <MDBox display="flex" gap={0.5} flexWrap="wrap">
                      {['Technology', 'Healthcare', 'Manufacturing', 'SaaS'].map((sector, index) => (
                        <MDBox 
                          key={index}
                          px={1} 
                          py={0.25} 
                          sx={{ 
                            backgroundColor: '#DBEAFE', 
                            color: '#1E40AF', 
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: 'medium'
                          }}
                        >
                          {sector}
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>
                </Grid>
                <Grid size={12}>
                  <MDBox p={1} sx={{ backgroundColor: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
                    <MDTypography variant="caption" fontWeight="bold" sx={{ color: '#92400E', fontSize: '0.65rem' }}>
                      🎯 Opportunity Alert: 3 distressed assets in target sectors available for quick acquisition
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

          {/* Team Performance Summary */}
          <Grid size={6}>
            <Card sx={{ height: '350px', width: '100%' }}>
            <CardContent sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Users size={20} color="#059669" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Team Performance
                </MDTypography>
              </MDBox>
              
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                <Grid size={4}>
                  <MDBox textAlign="center" p={0.5}>
                    <MDTypography variant="h5" fontWeight="bold" color="success" sx={{ fontSize: '1.1rem' }}>
                      87%
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                      Team Win Rate
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid size={4}>
                  <MDBox textAlign="center" p={0.5}>
                    <MDTypography variant="h5" fontWeight="bold" color="info" sx={{ fontSize: '1.1rem' }}>
                      42
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                      Avg Days to Close
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid size={4}>
                  <MDBox textAlign="center" p={0.5}>
                    <MDTypography variant="h5" fontWeight="bold" color="warning" sx={{ fontSize: '1.1rem' }}>
                      $3.2M
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                      Avg Deal Size
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
              
              <MDBox>
                <MDTypography variant="body2" fontWeight="bold" color="dark" mb={0.5} sx={{ fontSize: '0.8rem' }}>
                  Top Performers This Month
                </MDTypography>
                {[
                  { name: 'Sarah Johnson', deals: '3 deals', revenue: '$8.2M', badge: '🏆' },
                  { name: 'Mike Wilson', deals: '2 deals', revenue: '$5.7M', badge: '⭐' },
                  { name: 'John Smith', deals: '4 deals', revenue: '$12.1M', badge: '🎯' }
                ].map((performer, index) => (
                  <MDBox key={index} display="flex" justifyContent="space-between" alignItems="center" mb={0.5} p={0.75} sx={{ backgroundColor: index === 0 ? '#F0FDF4' : '#F9FAFB', borderRadius: '4px' }}>
                    <MDBox display="flex" alignItems="center">
                      <MDTypography variant="body2" mr={0.5} sx={{ fontSize: '0.75rem' }}>{performer.badge}</MDTypography>
                      <MDTypography variant="body2" fontWeight="medium" color="dark" sx={{ fontSize: '0.75rem' }}>
                        {performer.name}
                      </MDTypography>
                    </MDBox>
                    <MDBox textAlign="right">
                      <MDTypography variant="caption" color="success" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
                        {performer.revenue}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" display="block" sx={{ fontSize: '0.65rem' }}>
                        {performer.deals}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                ))}
              </MDBox>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
};

export default ExecutiveDashboard;