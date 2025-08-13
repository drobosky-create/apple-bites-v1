import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, DollarSign } from 'lucide-react';

const CRMReports = () => {
  const reportTypes = [
    {
      title: 'Deal Pipeline Report',
      description: 'Comprehensive overview of deals by stage and performance',
      icon: BarChart3,
      color: '#1976d2'
    },
    {
      title: 'Contact Analytics',
      description: 'Contact engagement and conversion metrics',
      icon: PieChart,
      color: '#2e7d32'
    },
    {
      title: 'Revenue Forecast',
      description: 'Projected revenue based on current pipeline',
      icon: TrendingUp,
      color: '#ed6c02'
    },
    {
      title: 'Activity Summary',
      description: 'Team activity and productivity analysis',
      icon: Calendar,
      color: '#9c27b0'
    }
  ];

  const quickStats = [
    { label: 'Total Pipeline Value', value: '$2.4M', icon: DollarSign },
    { label: 'Conversion Rate', value: '24%', icon: TrendingUp },
    { label: 'Average Deal Size', value: '$185K', icon: BarChart3 },
    { label: 'Active Deals', value: '13', icon: PieChart }
  ];

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Reports & Analytics
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Business intelligence and performance insights
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info">
          <Download size={16} />
          &nbsp;Export Data
        </MDButton>
      </MDBox>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={4}>
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox>
                      <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                        {stat.label}
                      </MDTypography>
                      <MDTypography variant="h4" fontWeight="bold" color="dark">
                        {stat.value}
                      </MDTypography>
                    </MDBox>
                    <MDBox 
                      bgcolor="info.main" 
                      borderRadius="50%" 
                      width="3rem" 
                      height="3rem" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <IconComponent size={20} color="white" />
                    </MDBox>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Report Types */}
      <Grid container spacing={3}>
        {reportTypes.map((report, index) => {
          const IconComponent = report.icon;
          return (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <MDBox display="flex" alignItems="start" mb={2}>
                    <MDBox 
                      bgcolor={report.color} 
                      borderRadius="8px" 
                      width="3rem" 
                      height="3rem" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      mr={2}
                    >
                      <IconComponent size={20} color="white" />
                    </MDBox>
                    
                    <MDBox flex={1}>
                      <MDTypography variant="h6" fontWeight="bold" mb={1}>
                        {report.title}
                      </MDTypography>
                      <MDTypography variant="body2" color="text" mb={2}>
                        {report.description}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  
                  <MDBox display="flex" gap={1}>
                    <MDButton variant="gradient" color="primary" size="small">
                      Generate
                    </MDButton>
                    <MDButton variant="outlined" color="primary" size="small">
                      Schedule
                    </MDButton>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Advanced Analytics Placeholder */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <MDBox textAlign="center" py={4}>
            <BarChart3 size={64} color="#666" style={{ marginBottom: '16px' }} />
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Advanced Analytics Dashboard
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={3}>
              Interactive charts, custom dashboards, and detailed analytics coming soon
            </MDTypography>
            <MDButton variant="gradient" color="info">
              Learn More
            </MDButton>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
};

export default CRMReports;