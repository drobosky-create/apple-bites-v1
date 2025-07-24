import React from 'react';
import { Typography, Box } from '@mui/material';
import {
  MaterialCard,
  MaterialCardHeader,
  MaterialCardBody,
  MaterialCardFooter,
  MaterialButton,
  MaterialTextField,
  MaterialTitle,
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
} from '@/components/ui/material-dashboard-system';
import { 
  Dashboard, 
  Person, 
  AttachMoney, 
  TrendingUp, 
} from '@mui/icons-material';

export default function SimpleComponentShowcase() {
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
          
          <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
            {/* Stats Cards */}
            <Box flex="1" minWidth="250px">
              <MaterialStatsCard
                title="Total Valuations"
                value="1,234"
                icon={<Dashboard style={{ fontSize: '2rem' }} />}
                color="primary"
                footer={
                  <Box display="flex" alignItems="center">
                    <TrendingUp style={{ color: '#4caf50', marginRight: '5px' }} />
                    <Typography variant="body2" color="textSecondary">
                      +12% from last month
                    </Typography>
                  </Box>
                }
              />
            </Box>
            
            <Box flex="1" minWidth="250px">
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
            </Box>
            
            <Box flex="1" minWidth="250px">
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
            </Box>
          </Box>
        </Box>

        {/* Material Dashboard Cards */}
        <Box mb={6}>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box flex="1" minWidth="400px">
              <MaterialCard>
                <MaterialCardHeader color="primary">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Regular Card with Primary Header
                  </Typography>
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
            </Box>
            
            <Box flex="1" minWidth="400px">
              <MaterialCard>
                <MaterialCardHeader color="success">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Success Card with Actions
                  </Typography>
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
            </Box>
          </Box>
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

        {/* Brand Color System */}
        <Box sx={{ padding: '40px 20px', borderRadius: '16px', background: '#f5f5f5', mb: 6 }}>
          <MaterialTitle variant="h4" gutterBottom>
            Brand Color System
          </MaterialTitle>
          
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box flex="1" minWidth="300px">
              <MaterialCard>
                <MaterialCardHeader color="primary">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Primary Navy
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" gutterBottom>
                    Main brand color used for headers, primary buttons, and key navigation elements.
                  </Typography>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    #0b2147
                  </Typography>
                </MaterialCardBody>
              </MaterialCard>
            </Box>
            
            <Box flex="1" minWidth="300px">
              <MaterialCard>
                <MaterialCardHeader color="secondary">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Secondary Teal
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" gutterBottom>
                    Accent color for highlights, secondary actions, and visual emphasis.
                  </Typography>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    #81e5d8
                  </Typography>
                </MaterialCardBody>
              </MaterialCard>
            </Box>
            
            <Box flex="1" minWidth="300px">
              <MaterialCard>
                <MaterialCardHeader color="accent">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Accent Blue
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" gutterBottom>
                    Supporting blue for links, information displays, and complementary elements.
                  </Typography>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    #4493de
                  </Typography>
                </MaterialCardBody>
              </MaterialCard>
            </Box>
          </Box>
        </Box>
        
        {/* Form Example */}
        <Box mt={6}>
          <MaterialCard>
            <MaterialCardHeader color="accent">
              <Typography variant="h6" style={{ color: 'white' }}>
                Contact Form Example
              </Typography>
            </MaterialCardHeader>
            <MaterialCardBody>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1" minWidth="250px">
                  <MaterialTextField
                    fullWidth
                    label="First Name"
                    margin="normal"
                  />
                </Box>
                <Box flex="1" minWidth="250px">
                  <MaterialTextField
                    fullWidth
                    label="Last Name"
                    margin="normal"
                  />
                </Box>
                <Box width="100%">
                  <MaterialTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                  />
                </Box>
                <Box width="100%">
                  <MaterialTextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Box>
              </Box>
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