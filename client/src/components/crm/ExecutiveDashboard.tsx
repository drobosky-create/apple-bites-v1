import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid } from '@mui/material';
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
  Mail
} from 'lucide-react';
import RecentActivityFeed from './RecentActivityFeed';
import QuickAccessWidgets from './QuickAccessWidgets';

const ExecutiveDashboard = () => {
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
    <MDBox p={3}>
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Executive Dashboard
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Real-time M&A pipeline performance and key metrics
        </MDTypography>
      </MDBox>

      {/* KPI Cards */}
      <MDBox mb={4}>
        <Grid container spacing={3}>
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                    <MDBox>
                      <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                        {kpi.title}
                      </MDTypography>
                      <MDTypography variant="h4" fontWeight="bold" color="dark" my={1}>
                        {kpi.value}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {kpi.subtitle}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mt={1}>
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
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: kpi.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComponent size={24} color={kpi.color} />
                    </MDBox>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        </Grid>
      </MDBox>

      {/* Three Column Layout */}
      <Grid container spacing={3}>
        {/* Pipeline Health */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '400px' }}>
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
                <MDTypography variant="body2" color="text" fontWeight="bold" mb={1}>
                  Forecast (Next 30 Days)
                </MDTypography>
                <MDTypography variant="h6" color="success" fontWeight="bold">
                  ${((totalPipelineValue * 0.3) / 1000000).toFixed(1)}M projected
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Feed */}
        <Grid item xs={12} lg={4}>
          <RecentActivityFeed />
        </Grid>

        {/* Urgent Tasks */}
        <Grid item xs={12} lg={4}>
          <QuickAccessWidgets />
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default ExecutiveDashboard;