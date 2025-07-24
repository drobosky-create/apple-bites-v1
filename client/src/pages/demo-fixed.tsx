import React from 'react';
import { 
  MaterialCard, 
  MaterialCardHeader, 
  MaterialCardBody, 
  MaterialCardFooter,
  MaterialButton, 
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
} from "@/components/ui/material-dashboard-system";
import { Box, Typography } from '@mui/material';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  TrendingUp, 
  FileText, 
  Download, 
  ExternalLink,
  LogOut,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign
} from "lucide-react";
import MaterialDashboardWrapper from '@/components/ui/MaterialDashboardWrapper';

// Demo component to showcase Material Dashboard design
export default function Demo() {
  // Mock user data for demo
  const user = {
    id: "demo-user",
    email: "demo@applebites.ai",
    firstName: "John",
    lastName: "Smith",
    tier: 'growth',
    resultReady: true
  };

  const tierInfo = {
    name: 'Growth & Exit Assessment',
    icon: TrendingUp,
    color: 'bg-blue-600',
    description: 'Professional industry-specific analysis with AI insights',
    price: '$795',
  };

  const TierIcon = tierInfo.icon;

  return (
    <MaterialDashboardWrapper>
      <MaterialBackground>
        <MaterialContainer>
          {/* Material Dashboard Header with Brand Gradient */}
          <MaterialCard>
            <MaterialCardHeader color="primary">
              <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <Box display="flex" alignItems="center" gap={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <img 
                      src="/apple-bites-logo.png" 
                      alt="Apple Bites Business Assessment" 
                      style={{ height: '48px', width: 'auto' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h5" style={{ color: 'white', fontWeight: 'bold' }}>
                      Welcome, {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {user.email}
                    </Typography>
                    <Badge className="bg-white/20 text-white border-white/30 font-medium">
                      {tierInfo.name}
                    </Badge>
                  </Box>
                </Box>
                <MaterialButton 
                  color="white"
                  simple
                >
                  <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Logout
                </MaterialButton>
              </Box>
            </MaterialCardHeader>
          </MaterialCard>
          
          {/* Material Dashboard Statistics Cards */}
          <Box mt={3} mb={3}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
              <MaterialStatsCard
                title="Account Status"
                value="Active"
                icon={<CheckCircle style={{ fontSize: '2rem' }} />}
                color="success"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    100% complete
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Assessment Tier"
                value={tierInfo.price}
                icon={<TierIcon style={{ fontSize: '2rem' }} />}
                color="primary"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    {tierInfo.name}
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Reports Generated"
                value="1"
                icon={<FileText style={{ fontSize: '2rem' }} />}
                color="warning"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    +1 this month
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Business Value"
                value="$2.4M"
                icon={<DollarSign style={{ fontSize: '2rem' }} />}
                color="success"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    +15% vs industry avg
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Main Content - Material Dashboard Layout */}
          <Box px={2}>
            <Box display="flex" flexDirection="column" gap={4}>
              {/* Assessment Status Card */}
              <MaterialCard>
                <MaterialCardHeader color="info">
                  <Typography variant="h6" style={{ color: 'white', fontWeight: 'bold' }}>
                    Assessment Status
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Your {tierInfo.name} ({tierInfo.price})
                  </Typography>
                  
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircle style={{ color: '#4caf50', fontSize: '1.25rem' }} />
                      <Typography variant="body1" color="success.main" fontWeight="medium">
                        Results Ready
                      </Typography>
                      <Badge className="bg-green-100 text-green-800">
                        Complete
                      </Badge>
                    </Box>

                    <Separator />

                    <Box>
                      <Typography variant="h6" color="textPrimary" fontWeight="medium" gutterBottom>
                        What's Included:
                      </Typography>
                      <Box component="ul" sx={{ paddingLeft: 2, margin: 0 }}>
                        <Box component="li" display="flex" alignItems="center" gap={1} mb={1}>
                          <CheckCircle style={{ color: '#4caf50', fontSize: '1rem' }} />
                          <Typography variant="body2">Industry-specific NAICS multipliers</Typography>
                        </Box>
                        <Box component="li" display="flex" alignItems="center" gap={1} mb={1}>
                          <CheckCircle style={{ color: '#4caf50', fontSize: '1rem' }} />
                          <Typography variant="body2">AI-powered business analysis</Typography>
                        </Box>
                        <Box component="li" display="flex" alignItems="center" gap={1} mb={1}>
                          <CheckCircle style={{ color: '#4caf50', fontSize: '1rem' }} />
                          <Typography variant="body2">Professional PDF report</Typography>
                        </Box>
                        <Box component="li" display="flex" alignItems="center" gap={1}>
                          <CheckCircle style={{ color: '#4caf50', fontSize: '1rem' }} />
                          <Typography variant="body2">Growth recommendations</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </MaterialCardBody>
              </MaterialCard>

              {/* Action Cards */}
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
                <MaterialCard>
                  <MaterialCardHeader color="success">
                    <Typography variant="h6" style={{ color: 'white' }}>
                      Download Report
                    </Typography>
                  </MaterialCardHeader>
                  <MaterialCardBody>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Your comprehensive business valuation report is ready for download.
                    </Typography>
                  </MaterialCardBody>
                  <MaterialCardFooter>
                    <MaterialButton color="success">
                      <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Download PDF
                    </MaterialButton>
                    <MaterialButton color="success" simple>
                      <Mail style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Email Report
                    </MaterialButton>
                  </MaterialCardFooter>
                </MaterialCard>

                <MaterialCard>
                  <MaterialCardHeader color="warning">
                    <Typography variant="h6" style={{ color: 'white' }}>
                      Schedule Consultation
                    </Typography>
                  </MaterialCardHeader>
                  <MaterialCardBody>
                    <Typography variant="body2" color="textSecondary">
                      Discuss your results with our valuation experts and explore growth opportunities.
                    </Typography>
                  </MaterialCardBody>
                  <MaterialCardFooter>
                    <MaterialButton color="warning">
                      <ExternalLink style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Book Consultation
                    </MaterialButton>
                  </MaterialCardFooter>
                </MaterialCard>
              </Box>
            </Box>
          </Box>
        </MaterialContainer>
      </MaterialBackground>
    </MaterialDashboardWrapper>
  );
}