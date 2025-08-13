import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  Users, 
  Award,
  BarChart3,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';

const AnalyticsInsights = () => {
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });
  const { data: contacts = [] } = useQuery({ queryKey: ['/api/contacts'] });

  // Calculate conversion rates between stages
  const stageConversions = [
    { from: 'Prospect', to: 'Initial Contact', rate: 85 },
    { from: 'Initial Contact', to: 'Qualification', rate: 72 },
    { from: 'Qualification', to: 'Needs Analysis', rate: 68 },
    { from: 'Needs Analysis', to: 'Proposal', rate: 58 },
    { from: 'Proposal', to: 'Negotiation', rate: 45 },
    { from: 'Negotiation', to: 'Contract', rate: 78 },
    { from: 'Contract', to: 'Due Diligence', rate: 89 },
    { from: 'Due Diligence', to: 'Closing', rate: 92 },
    { from: 'Closing', to: 'Closed Won', rate: 87 }
  ];

  // Team performance metrics
  const teamPerformance = [
    { name: 'John Smith', deals: 12, revenue: 8500000, winRate: 75 },
    { name: 'Sarah Johnson', deals: 8, revenue: 6200000, winRate: 80 },
    { name: 'Mike Wilson', deals: 10, revenue: 7100000, winRate: 70 },
    { name: 'Lisa Chen', deals: 6, revenue: 4800000, winRate: 83 }
  ];

  // Revenue forecasting
  const monthlyForecast = [
    { month: 'Jan', actual: 2.1, forecast: 2.0 },
    { month: 'Feb', actual: 2.8, forecast: 2.5 },
    { month: 'Mar', actual: 1.9, forecast: 2.2 },
    { month: 'Apr', actual: 3.2, forecast: 2.8 },
    { month: 'May', actual: null, forecast: 3.1 },
    { month: 'Jun', actual: null, forecast: 2.9 }
  ];

  // Deal cycle analysis
  const dealCycleBySize = [
    { range: '$1M - $5M', avgDays: 45, count: 12 },
    { range: '$5M - $10M', avgDays: 62, count: 8 },
    { range: '$10M - $25M', avgDays: 78, count: 5 },
    { range: '$25M+', avgDays: 95, count: 3 }
  ];

  return (
    <MDBox p={3}>
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Analytics & Insights
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Data-driven insights for optimizing your M&A performance
        </MDTypography>
      </MDBox>

      <Grid container spacing={3}>
        {/* Conversion Funnel */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <MDBox display="flex" alignItems="center">
                  <BarChart3 size={20} color="#3B82F6" />
                  <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                    Deal Conversion Funnel
                  </MDTypography>
                </MDBox>
                <MDButton size="small" variant="text" sx={{ color: '#3B82F6' }}>
                  Export Data
                </MDButton>
              </MDBox>

              <MDBox sx={{ overflowX: 'auto' }}>
                {stageConversions.map((conversion, index) => (
                  <MDBox key={index} mb={2}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="body2" color="dark" fontWeight="medium">
                        {conversion.from} → {conversion.to}
                      </MDTypography>
                      <MDTypography variant="body2" fontWeight="bold" color={conversion.rate >= 70 ? 'success' : conversion.rate >= 50 ? 'warning' : 'error'}>
                        {conversion.rate}%
                      </MDTypography>
                    </MDBox>
                    
                    <MDBox sx={{ width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 }}>
                      <MDBox 
                        sx={{ 
                          width: `${conversion.rate}%`,
                          height: '100%', 
                          backgroundColor: conversion.rate >= 70 ? '#059669' : conversion.rate >= 50 ? '#F59E0B' : '#EF4444',
                          borderRadius: 4,
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </MDBox>
                  </MDBox>
                ))}
              </MDBox>

              <MDBox mt={3} p={2} sx={{ backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <MDTypography variant="body2" color="text" fontWeight="bold" mb={1}>
                  Key Insights
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  • Strongest conversion: Due Diligence → Closing (92%)
                </MDTypography><br />
                <MDTypography variant="caption" color="text">
                  • Weakest conversion: Proposal → Negotiation (45%)
                </MDTypography><br />
                <MDTypography variant="caption" color="text">
                  • Overall pipeline efficiency: 68% above industry average
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Forecast */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={3}>
                <TrendingUp size={20} color="#059669" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Revenue Forecast
                </MDTypography>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" mb={1}>
                  Next 30 Days
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold" color="success">
                  $8.2M
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  Weighted pipeline value
                </MDTypography>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" mb={1}>
                  Next 90 Days
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold" color="dark">
                  $15.7M
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  Projected closings
                </MDTypography>
              </MDBox>

              {monthlyForecast.map((month, index) => (
                <MDBox key={index} mb={2}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <MDTypography variant="body2" color="text">
                      {month.month}
                    </MDTypography>
                    <MDBox display="flex" gap={1}>
                      {month.actual && (
                        <MDTypography variant="caption" color="dark" fontWeight="bold">
                          ${month.actual}M
                        </MDTypography>
                      )}
                      <MDTypography variant="caption" color="info" fontWeight="medium">
                        ${month.forecast}M
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox sx={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                    {month.actual && (
                      <MDBox 
                        sx={{ 
                          width: `${(month.actual / 4) * 100}%`,
                          height: '100%', 
                          backgroundColor: '#059669',
                          borderRadius: 2,
                          position: 'absolute'
                        }} 
                      />
                    )}
                    <MDBox 
                      sx={{ 
                        width: `${(month.forecast / 4) * 100}%`,
                        height: '100%', 
                        backgroundColor: month.actual ? 'rgba(59, 130, 246, 0.3)' : '#3B82F6',
                        borderRadius: 2
                      }} 
                    />
                  </MDBox>
                </MDBox>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '350px' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={3}>
                <Users size={20} color="#8B5CF6" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Team Performance
                </MDTypography>
              </MDBox>

              <MDBox sx={{ overflowY: 'auto', maxHeight: '260px' }}>
                {teamPerformance.map((member, index) => (
                  <MDBox key={index} mb={3} p={2} sx={{ backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                        {member.name}
                      </MDTypography>
                      <MDBox 
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                          backgroundColor: member.winRate >= 80 ? '#DCFCE7' : member.winRate >= 70 ? '#FEF3C7' : '#FEE2E2',
                          border: `1px solid ${member.winRate >= 80 ? '#16A34A' : member.winRate >= 70 ? '#D97706' : '#DC2626'}`
                        }}
                      >
                        <MDTypography 
                          variant="caption" 
                          sx={{ color: member.winRate >= 80 ? '#16A34A' : member.winRate >= 70 ? '#D97706' : '#DC2626' }}
                          fontWeight="bold"
                        >
                          {member.winRate}% win rate
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <MDTypography variant="caption" color="text">
                          Active Deals
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="bold" color="dark">
                          {member.deals}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6}>
                        <MDTypography variant="caption" color="text">
                          Revenue
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="bold" color="success">
                          ${(member.revenue / 1000000).toFixed(1)}M
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                ))}
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        {/* Deal Cycle Analysis */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '350px' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={3}>
                <Clock size={20} color="#F59E0B" />
                <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
                  Deal Cycle Analysis
                </MDTypography>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" mb={1}>
                  Overall Average
                </MDTypography>
                <MDTypography variant="h4" fontWeight="bold" color="dark">
                  62 days
                </MDTypography>
                <MDTypography variant="caption" color="success" fontWeight="medium">
                  -8 days from last quarter
                </MDTypography>
              </MDBox>

              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase" mb={2}>
                  By Deal Size
                </MDTypography>
                
                {dealCycleBySize.map((size, index) => (
                  <MDBox key={index} mb={2}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MDTypography variant="body2" color="dark" fontWeight="medium">
                        {size.range}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDTypography variant="caption" color="text">
                          {size.count} deals
                        </MDTypography>
                        <MDTypography variant="body2" fontWeight="bold" color="dark">
                          {size.avgDays} days
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    
                    <MDBox sx={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
                      <MDBox 
                        sx={{ 
                          width: `${(size.avgDays / 100) * 100}%`,
                          height: '100%', 
                          backgroundColor: size.avgDays <= 50 ? '#059669' : size.avgDays <= 75 ? '#F59E0B' : '#EF4444',
                          borderRadius: 3
                        }} 
                      />
                    </MDBox>
                  </MDBox>
                ))}
              </MDBox>

              <MDBox mt={3} p={2} sx={{ backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                <MDTypography variant="caption" color="#92400E" fontWeight="bold">
                  💡 Insight: Larger deals ($25M+) take 2x longer but have 15% higher close rates
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default AnalyticsInsights;