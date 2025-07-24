import React from 'react';
import { Grid2 as Grid, Typography, Box } from '@mui/material';
import {
  MaterialCard,
  MaterialCardHeader,
  MaterialCardBody,
  MaterialCardFooter,
  MaterialButton,
  MaterialTextField,
  MaterialTitle,
  MaterialCardTitle,
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
  AppBackground,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  StyledTextField,
  SectionHeader,
  DashboardCard,
  brandColors,
} from '@/components/ui';
import { 
  Dashboard, 
  Person, 
  AttachMoney, 
  TrendingUp, 
  Business,
  Assessment,
} from '@mui/icons-material';

export default function ComponentShowcase() {
  return (
    <MaterialBackground>
      <MaterialContainer maxWidth="lg">
        <MaterialTitle variant="h3" align="center" gutterBottom>
          Design System Showcase
        </MaterialTitle>
        
        {/* Material Dashboard Components Section */}
        <Box mb={6}>
          <MaterialTitle variant="h4" gutterBottom>
            Material Dashboard Components
          </MaterialTitle>
          
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid xs={12} sm={6} md={3}>
              <MaterialStatsCard
                title="Total Valuations"
                value="1,234"
                icon={<Assessment style={{ fontSize: '2rem' }} />}
                color="primary"
                footer={
                  <Box display="flex" alignItems="center">
                    <TrendingUp style={{ color: brandColors.success, marginRight: '5px' }} />
                    <Typography variant="body2" color="textSecondary">
                      +12% from last month
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <MaterialStatsCard
                title="Average Value"
                value="$2.4M"
                icon={<AttachMoney style={{ fontSize: '2rem' }} />}
                color="success"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    Industry leading accuracy
                  </Typography>
                }
              />
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <MaterialStatsCard
                title="Active Users"
                value="5,678"
                icon={<Person style={{ fontSize: '2rem' }} />}
                color="info"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    Growing every day
                  </Typography>
                }
              />
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <MaterialStatsCard
                title="Business Types"
                value="25+"
                icon={<Business style={{ fontSize: '2rem' }} />}
                color="warning"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    All major industries
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </Box>

        {/* Material Dashboard Cards */}
        <Box mb={6}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <MaterialCard>
                <MaterialCardHeader color="primary">
                  <MaterialCardTitle variant="h6" style={{ color: 'white' }}>
                    Regular Card with Primary Header
                  </MaterialCardTitle>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body1" gutterBottom>
                    This is a Material Dashboard card with a gradient header. Perfect for displaying important information with visual hierarchy.
                  </Typography>
                  <MaterialTextField
                    fullWidth
                    label="Sample Input"
                    margin="normal"
                    helperText="Material Dashboard styled input"
                  />
                </MaterialCardBody>
                <MaterialCardFooter>
                  <MaterialButton color="primary" size="sm">
                    Primary Action
                  </MaterialButton>
                  <MaterialButton color="secondary" simple size="sm">
                    Secondary
                  </MaterialButton>
                </MaterialCardFooter>
              </MaterialCard>
            </Grid>
            
            <Grid xs={12} md={6}>
              <MaterialCard>
                <MaterialCardHeader color="success">
                  <MaterialCardTitle variant="h6" style={{ color: 'white' }}>
                    Success Card with Actions
                  </MaterialCardTitle>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="h4" color="textPrimary" gutterBottom>
                    $2,450,000
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Estimated Business Value
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2" gutterBottom>
                      Valuation completed with 95% confidence based on:
                    </Typography>
                    <Typography variant="body2" component="ul" style={{ paddingLeft: '20px' }}>
                      <li>Financial performance</li>
                      <li>Market conditions</li>
                      <li>Industry benchmarks</li>
                    </Typography>
                  </Box>
                </MaterialCardBody>
              </MaterialCard>
            </Grid>
          </Grid>
        </Box>

        {/* Button Showcase */}
        <Box mb={6}>
          <MaterialTitle variant="h4" gutterBottom>
            Button Variations
          </MaterialTitle>
          
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <MaterialButton color="primary">Primary</MaterialButton>
            <MaterialButton color="secondary">Secondary</MaterialButton>
            <MaterialButton color="success">Success</MaterialButton>
            <MaterialButton color="warning">Warning</MaterialButton>
            <MaterialButton color="danger">Danger</MaterialButton>
            <MaterialButton color="info">Info</MaterialButton>
            <MaterialButton color="rose">Rose</MaterialButton>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <MaterialButton color="primary" round>Rounded</MaterialButton>
            <MaterialButton color="secondary" size="lg">Large</MaterialButton>
            <MaterialButton color="success" size="sm">Small</MaterialButton>
            <MaterialButton color="info" simple>Simple</MaterialButton>
            <MaterialButton color="warning" link>Link Style</MaterialButton>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={2}>
            <MaterialButton color="primary" justIcon>
              <Dashboard />
            </MaterialButton>
            <MaterialButton color="success" justIcon round>
              <Person />
            </MaterialButton>
            <MaterialButton color="danger" justIcon>
              <AttachMoney />
            </MaterialButton>
          </Box>
        </Box>

        <AppBackground style={{ padding: '40px 20px', borderRadius: '16px' }}>
          <SectionHeader>Apple Bites Glass Design System</SectionHeader>
          
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <GlassCard style={{ padding: '24px' }}>
                <Typography variant="h6" style={{ color: 'white', marginBottom: '16px' }}>
                  Glass Card Example
                </Typography>
                <Typography variant="body2" style={{ color: '#f7fafc', marginBottom: '20px' }}>
                  This card uses the glass morphism design with backdrop blur effects.
                </Typography>
                <StyledTextField
                  fullWidth
                  label="Glass Input"
                  margin="normal"
                />
                <Box mt={2}>
                  <PrimaryButton size="small">
                    Primary Action
                  </PrimaryButton>
                </Box>
              </GlassCard>
            </Grid>
            
            <Grid xs={12} md={4}>
              <DashboardCard>
                <Typography variant="h6" style={{ color: 'white', marginBottom: '16px' }}>
                  Dashboard Card
                </Typography>
                <Typography variant="h4" style={{ color: '#81e5d8', marginBottom: '8px' }}>
                  $1.2M
                </Typography>
                <Typography variant="body2" style={{ color: '#a0aec0' }}>
                  Business Valuation
                </Typography>
                <Box mt={2} display="flex" gap={1}>
                  <SecondaryButton size="small">
                    Details
                  </SecondaryButton>
                  <OutlineButton size="small">
                    Export
                  </OutlineButton>
                </Box>
              </DashboardCard>
            </Grid>
            
            <Grid xs={12} md={4}>
              <GlassCard style={{ padding: '24px', textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #81e5d8 0%, #4493de 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <TrendingUp style={{ color: 'white', fontSize: '2rem' }} />
                </Box>
                <Typography variant="h6" style={{ color: 'white', marginBottom: '8px' }}>
                  Growth Metrics
                </Typography>
                <Typography variant="body2" style={{ color: '#a0aec0' }}>
                  Track your business performance with real-time analytics
                </Typography>
              </GlassCard>
            </Grid>
          </Grid>
        </AppBackground>
        
        {/* Form Example */}
        <Box mt={6}>
          <MaterialCard>
            <MaterialCardHeader color="accent">
              <MaterialCardTitle variant="h6" style={{ color: 'white' }}>
                Contact Form Example
              </MaterialCardTitle>
            </MaterialCardHeader>
            <MaterialCardBody>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <MaterialTextField
                    fullWidth
                    label="First Name"
                    margin="normal"
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <MaterialTextField
                    fullWidth
                    label="Last Name"
                    margin="normal"
                  />
                </Grid>
                <Grid xs={12}>
                  <MaterialTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                  />
                </Grid>
                <Grid xs={12}>
                  <MaterialTextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </MaterialCardBody>
            <MaterialCardFooter>
              <MaterialButton color="accent">
                Send Message
              </MaterialButton>
              <MaterialButton simple color="accent">
                Reset Form
              </MaterialButton>
            </MaterialCardFooter>
          </MaterialCard>
        </Box>
      </MaterialContainer>
    </MaterialBackground>
  );
}