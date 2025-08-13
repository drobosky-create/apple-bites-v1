import React from 'react';
import { Card, CardContent, Grid, Chip } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { Mail, Plus, Play, Pause, BarChart3, Clock, Users } from 'lucide-react';

const CRMSequences = () => {
  const emailSequences = [
    {
      id: 1,
      name: 'New Prospect Onboarding',
      description: 'Welcome sequence for new business prospects',
      status: 'active',
      emails: 5,
      subscribers: 24,
      openRate: '68%',
      color: '#2e7d32'
    },
    {
      id: 2,
      name: 'Follow-up After Valuation',
      description: 'Post-assessment engagement sequence',
      status: 'active',
      emails: 3,
      subscribers: 18,
      openRate: '72%',
      color: '#1976d2'
    },
    {
      id: 3,
      name: 'Cold Outreach - Manufacturing',
      description: 'Industry-specific outreach for manufacturing firms',
      status: 'paused',
      emails: 4,
      subscribers: 156,
      openRate: '45%',
      color: '#ed6c02'
    },
    {
      id: 4,
      name: 'Re-engagement Campaign',
      description: 'Win back inactive prospects',
      status: 'draft',
      emails: 6,
      subscribers: 0,
      openRate: 'N/A',
      color: '#666'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Email Sequences
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Automated email campaigns and nurture sequences
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info">
          <Plus size={16} />
          &nbsp;New Sequence
        </MDButton>
      </MDBox>

      <Grid container spacing={3} mb={4}>
        {emailSequences.map((sequence) => (
          <Grid item xs={12} md={6} key={sequence.id}>
            <Card>
              <CardContent>
                <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <MDBox>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <MDTypography variant="h6" fontWeight="bold">
                        {sequence.name}
                      </MDTypography>
                      <Chip 
                        label={sequence.status}
                        size="small"
                        color={getStatusColor(sequence.status)}
                        sx={{ ml: 1, textTransform: 'capitalize' }}
                      />
                    </MDBox>
                    <MDTypography variant="body2" color="text">
                      {sequence.description}
                    </MDTypography>
                  </MDBox>
                  
                  <MDBox display="flex" gap={0.5}>
                    {sequence.status === 'active' ? (
                      <MDButton variant="outlined" size="small" color="warning">
                        <Pause size={14} />
                      </MDButton>
                    ) : (
                      <MDButton variant="outlined" size="small" color="success">
                        <Play size={14} />
                      </MDButton>
                    )}
                  </MDBox>
                </MDBox>

                {/* Sequence Stats */}
                <MDBox 
                  bgcolor="#f8f9fa" 
                  borderRadius="8px" 
                  p={2} 
                  mb={2}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                          <Mail size={14} style={{ marginRight: '4px', color: '#666' }} />
                          <MDTypography variant="h6" fontWeight="bold" color="dark">
                            {sequence.emails}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="caption" color="text">
                          Emails
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                          <Users size={14} style={{ marginRight: '4px', color: '#666' }} />
                          <MDTypography variant="h6" fontWeight="bold" color="dark">
                            {sequence.subscribers}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="caption" color="text">
                          Active
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                          <BarChart3 size={14} style={{ marginRight: '4px', color: '#666' }} />
                          <MDTypography variant="h6" fontWeight="bold" color="dark">
                            {sequence.openRate}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="caption" color="text">
                          Open Rate
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox display="flex" gap={1}>
                  <MDButton variant="gradient" color="primary" size="small">
                    Edit
                  </MDButton>
                  <MDButton variant="outlined" color="primary" size="small">
                    Analytics
                  </MDButton>
                </MDBox>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sequence Performance Overview */}
      <Card>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <BarChart3 size={24} color="#1976d2" style={{ marginRight: '12px' }} />
            <MDBox>
              <MDTypography variant="h6" fontWeight="bold">
                Sequence Performance Overview
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Aggregate metrics across all active sequences
              </MDTypography>
            </MDBox>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="info">
                  198
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Total Subscribers
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="success">
                  62%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Avg. Open Rate
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="warning">
                  18%
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Click Rate
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDBox textAlign="center" py={2}>
                <MDTypography variant="h4" fontWeight="bold" color="error">
                  8.5%
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

export default CRMSequences;