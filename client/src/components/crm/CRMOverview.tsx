import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import { Users, Building2, DollarSign, TrendingUp, Activity, Calendar } from 'lucide-react';

const CRMOverview = () => {
  const { data: contacts = [] } = useQuery({ queryKey: ['/api/contacts'] });
  const { data: firms = [] } = useQuery({ queryKey: ['/api/firms'] });
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });

  const stats = [
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: Users,
      color: 'info',
      change: '+12%'
    },
    {
      title: 'Active Firms',
      value: firms.length,
      icon: Building2,
      color: 'success',
      change: '+8%'
    },
    {
      title: 'Deals in Pipeline',
      value: deals.length,
      icon: DollarSign,
      color: 'primary',
      change: '+15%'
    },
    {
      title: 'Monthly Growth',
      value: '24%',
      icon: TrendingUp,
      color: 'warning',
      change: '+3%'
    }
  ];

  return (
    <MDBox p={3}>
      <MDBox mb={3}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          CRM Overview
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Your comprehensive business relationship dashboard
        </MDTypography>
      </MDBox>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox>
                      <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                        {stat.title}
                      </MDTypography>
                      <MDTypography variant="h4" fontWeight="bold" color="dark">
                        {stat.value}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mt={1}>
                        <MDTypography variant="caption" color="success" fontWeight="bold">
                          {stat.change}
                        </MDTypography>
                        <MDTypography variant="caption" color="text" ml={0.5}>
                          this month
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox 
                      bgcolor={`${stat.color}.main`} 
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <MDBox mb={2}>
                <MDTypography variant="h6" fontWeight="bold">
                  Recent Activity
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox display="flex" alignItems="center" py={1} borderBottom="1px solid #f0f0f0">
                  <Activity size={16} style={{ marginRight: '12px', color: '#1976d2' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      New contact added: John Smith
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      2 hours ago
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" py={1} borderBottom="1px solid #f0f0f0">
                  <Building2 size={16} style={{ marginRight: '12px', color: '#2e7d32' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      Firm updated: TechCorp Solutions
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      4 hours ago
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" py={1}>
                  <DollarSign size={16} style={{ marginRight: '12px', color: '#ed6c02' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      Deal moved to negotiation: $250K transaction
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      6 hours ago
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <MDBox mb={2}>
                <MDTypography variant="h6" fontWeight="bold">
                  Upcoming Tasks
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox display="flex" alignItems="center" py={1} borderBottom="1px solid #f0f0f0">
                  <Calendar size={16} style={{ marginRight: '12px', color: '#1976d2' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      Follow up with ABC Corp
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      Today, 3:00 PM
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" py={1} borderBottom="1px solid #f0f0f0">
                  <Calendar size={16} style={{ marginRight: '12px', color: '#ed6c02' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      Prepare valuation report
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      Tomorrow, 10:00 AM
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" py={1}>
                  <Calendar size={16} style={{ marginRight: '12px', color: '#2e7d32' }} />
                  <MDBox>
                    <MDTypography variant="body2" fontWeight="medium">
                      Client presentation
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      Friday, 2:00 PM
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default CRMOverview;