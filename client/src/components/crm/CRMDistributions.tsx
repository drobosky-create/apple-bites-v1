import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { Send, FileText, Users, Target, TrendingUp } from 'lucide-react';

const CRMDistributions = () => {
  const distributionTypes = [
    {
      title: 'Email Campaigns',
      description: 'Send targeted email campaigns to segmented contact lists',
      icon: Send,
      color: '#1976d2',
      stats: { sent: 245, delivered: 238, opened: 142 }
    },
    {
      title: 'Document Distribution',
      description: 'Share valuation reports and presentations with clients',
      icon: FileText,
      color: '#2e7d32',
      stats: { shared: 18, viewed: 15, downloaded: 12 }
    },
    {
      title: 'Prospect Lists',
      description: 'Distribute prospect lists to team members',
      icon: Users,
      color: '#ed6c02',
      stats: { active: 3, contacts: 156, assigned: 8 }
    },
    {
      title: 'Marketing Materials',
      description: 'Distribute branded marketing content and case studies',
      icon: Target,
      color: '#9c27b0',
      stats: { campaigns: 5, reach: 1250, engagement: '18%' }
    }
  ];

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Distributions
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage content distribution and campaign delivery
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info">
          <Send size={16} />
          &nbsp;New Distribution
        </MDButton>
      </MDBox>

      <Grid container spacing={3} mb={4}>
        {distributionTypes.map((type, index) => {
          const IconComponent = type.icon;
          return (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <MDBox display="flex" alignItems="start" mb={2}>
                    <MDBox 
                      bgcolor={type.color} 
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
                        {type.title}
                      </MDTypography>
                      <MDTypography variant="body2" color="text" mb={2}>
                        {type.description}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  
                  {/* Stats */}
                  <MDBox 
                    bgcolor="#f8f9fa" 
                    borderRadius="8px" 
                    p={2} 
                    mb={2}
                  >
                    <Grid container spacing={2}>
                      {Object.entries(type.stats).map(([key, value]) => (
                        <Grid item xs={4} key={key}>
                          <MDBox textAlign="center">
                            <MDTypography variant="h6" fontWeight="bold" color="dark">
                              {value}
                            </MDTypography>
                            <MDTypography variant="caption" color="text" textTransform="capitalize">
                              {key}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                  
                  <MDBox display="flex" gap={1}>
                    <MDButton variant="gradient" color="primary" size="small">
                      Manage
                    </MDButton>
                    <MDButton variant="outlined" color="primary" size="small">
                      Analytics
                    </MDButton>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Distribution Performance */}
      <Card>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <TrendingUp size={24} color="#1976d2" style={{ marginRight: '12px' }} />
            <MDBox>
              <MDTypography variant="h6" fontWeight="bold">
                Distribution Performance
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Overall engagement and delivery metrics
              </MDTypography>
            </MDBox>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="success">
                  94%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Delivery Rate
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="info">
                  58%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Open Rate
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="warning">
                  24%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Click Rate
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="error">
                  3.2%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Conversion Rate
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </MDBox>
  );
};

export default CRMDistributions;