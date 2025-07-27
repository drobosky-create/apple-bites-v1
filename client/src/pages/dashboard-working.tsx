import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import { TrendingUp, Assessment, AccountCircle } from '@mui/icons-material';
// Import Material Dashboard components
import { MDBox, MDTypography, MDButton } from "@/components/MD";

export default function WorkingDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mock user data for demonstration
  const userData = {
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User", 
    email: user?.email || "demo@example.com",
    tier: user?.tier || "free"
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MDTypography variant="h6" color="text">Loading...</MDTypography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section with Material Dashboard components */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
          Welcome to Apple Bites
        </MDTypography>
        <MDTypography variant="body1" color="text">
          Professional business valuations powered by AI
        </MDTypography>
      </MDBox>

      {/* User Profile and Assessment Actions */}
      <MDBox display="flex" gap={3} mb={4} flexWrap="wrap">
        {/* User Profile Card */}
        <Card sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                <AccountCircle fontSize="large" />
              </Avatar>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium" color="dark">
                  {userData.firstName} {userData.lastName}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {userData.email}
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <Chip 
              label={`${userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)} Tier`}
              color={userData.tier === 'free' ? 'default' : 'primary'}
              size="small"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        {/* Assessment Actions */}
        <Card sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={3}>
              <TrendingUp sx={{ mr: 1, color: '#1A73E8' }} />
              <MDTypography variant="h6" fontWeight="medium" color="dark">
                Start Your Business Assessment
              </MDTypography>
            </MDBox>

            <MDTypography variant="body1" color="text" mb={3}>
              Get comprehensive insights into your business value with our AI-powered assessment tools.
            </MDTypography>

            <MDBox display="flex" gap={2} flexWrap="wrap">
              {/* Material Dashboard gradient button */}
              <MDButton 
                variant="gradient"
                color="info"
                size="large"
                onClick={() => setLocation('/assessment/free')}
                startIcon={<Assessment />}
              >
                Start Free Assessment
              </MDButton>

              <MDButton 
                variant="contained"
                color="success"
                onClick={() => setLocation('/value-calculator')}
              >
                Value Calculator
              </MDButton>
            </MDBox>
          </CardContent>
        </Card>
      </MDBox>

      {/* Business Value Range Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <TrendingUp sx={{ mr: 2, color: '#1A73E8' }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Estimated Business Value Range
            </MDTypography>
          </MDBox>
          
          <MDBox display="flex" gap={3} flexWrap="wrap" mb={3}>
            <MDBox flex="1" minWidth="200px">
              <MDBox variant="gradient" bgColor="info" p={3} borderRadius="lg" shadow="md" mb={2}>
                <MDTypography variant="h4" fontWeight="bold" color="white" textAlign="center">
                  $2.1M - $4.8M
                </MDTypography>
                <MDTypography variant="body2" color="white" textAlign="center" opacity={0.8}>
                  Based on Industry Analysis
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <MDBox flex="1" minWidth="200px">
              <MDBox bgColor="white" p={3} borderRadius="lg" shadow="md" mb={2} border="1px solid #e0e0e0">
                <MDTypography variant="body1" color="text" mb={1}>
                  <strong>EBITDA Multiple:</strong> 3.2x - 4.5x
                </MDTypography>
                <MDTypography variant="body1" color="text" mb={1}>
                  <strong>Industry:</strong> Professional Services
                </MDTypography>
                <MDTypography variant="body1" color="text">
                  <strong>Overall Grade:</strong> B+
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </CardContent>
      </Card>

      {/* Grade Distribution Matrix */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Assessment sx={{ mr: 2, color: '#4CAF50' }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Value Driver Assessment
            </MDTypography>
          </MDBox>
          
          <MDBox display="flex" gap={2} flexWrap="wrap" mb={3}>
            {/* Grade tiles */}
            {[
              { label: 'Financial Performance', grade: 'B+' },
              { label: 'Customer Base', grade: 'A-' },
              { label: 'Management Team', grade: 'B' },
              { label: 'Market Position', grade: 'B+' },
              { label: 'Growth Prospects', grade: 'A' },
              { label: 'Systems & Processes', grade: 'C+' },
              { label: 'Asset Quality', grade: 'B' },
              { label: 'Industry Outlook', grade: 'B+' },
              { label: 'Risk Factors', grade: 'B-' },
              { label: 'Owner Dependency', grade: 'C' }
            ].map((driver, index) => (
              <MDBox 
                key={index}
                flex="1 1 200px" 
                minWidth="200px"
                bgColor="white"
                p={2}
                borderRadius="lg"
                shadow="sm"
                border="1px solid #e0e0e0"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography variant="body2" fontWeight="medium" color="text">
                  {driver.label}
                </MDTypography>
                <MDBox
                  width="48px"
                  height="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgColor={
                    driver.grade.startsWith('A') ? 'rgba(66, 165, 245, 0.1)' :
                    driver.grade.startsWith('B') ? 'rgba(139, 195, 74, 0.1)' :
                    driver.grade.startsWith('C') ? 'rgba(255, 152, 0, 0.1)' :
                    'rgba(244, 67, 54, 0.1)'
                  }
                  borderRadius="8px"
                  border={`2px solid ${
                    driver.grade.startsWith('A') ? '#42a5f5' :
                    driver.grade.startsWith('B') ? '#8bc34a' :
                    driver.grade.startsWith('C') ? '#ff9800' :
                    '#f44336'
                  }`}
                >
                  <MDTypography
                    variant="subtitle1"
                    fontWeight="bold"
                    color={
                      driver.grade.startsWith('A') ? '#42a5f5' :
                      driver.grade.startsWith('B') ? '#8bc34a' :
                      driver.grade.startsWith('C') ? '#ff9800' :
                      '#f44336'
                    }
                  >
                    {driver.grade}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>
        </CardContent>
      </Card>

      {/* Capital Readiness Score */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <TrendingUp sx={{ mr: 2, color: '#ff9800' }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Capital Readiness Score
            </MDTypography>
          </MDBox>
          
          <MDBox display="flex" alignItems="center" gap={3} mb={3}>
            <MDBox variant="gradient" bgColor="warning" p={3} borderRadius="lg" shadow="md">
              <MDTypography variant="h3" fontWeight="bold" color="white" textAlign="center">
                75%
              </MDTypography>
              <MDTypography variant="body2" color="white" textAlign="center" opacity={0.8}>
                Ready for Investment
              </MDTypography>
            </MDBox>
            
            <MDBox flex="1">
              <MDTypography variant="body1" color="text" mb={2}>
                Your business shows strong fundamentals with room for improvement in operational systems and owner dependency reduction.
              </MDTypography>
              <MDTypography variant="body2" color="text">
                <strong>Key Strengths:</strong> Strong financials, diversified customer base, growth potential<br/>
                <strong>Focus Areas:</strong> Systems documentation, management depth, process optimization
              </MDTypography>
            </MDBox>
          </MDBox>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <MDBox display="flex" gap={3} mb={4} flexWrap="wrap">
        <MDButton
          variant="gradient"
          color="success"
          size="large"
          onClick={() => setLocation('/value-calculator')}
          startIcon={<TrendingUp />}
        >
          Explore Value Improvements
        </MDButton>
        
        <MDButton
          variant="contained"
          color="info"
          size="large"
          startIcon={<Assessment />}
        >
          Download Full Report
        </MDButton>
        
        <MDButton
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => setLocation('/assessment/free')}
        >
          Update Assessment
        </MDButton>
      </MDBox>

      {/* Next Steps Recommendations */}
      <Card>
        <CardContent>
          <MDBox display="flex" alignItems="center" mb={3}>
            <AccountCircle sx={{ mr: 2, color: '#1A73E8' }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Recommended Next Steps
            </MDTypography>
          </MDBox>
          
          <MDBox>
            {[
              {
                title: 'Strengthen Operational Systems',
                description: 'Document key processes and reduce owner dependency',
                priority: 'High',
                timeframe: '3-6 months'
              },
              {
                title: 'Develop Management Succession',
                description: 'Build leadership depth and management capabilities',
                priority: 'Medium',
                timeframe: '6-12 months'
              },
              {
                title: 'Market Position Enhancement',
                description: 'Strengthen competitive advantages and market differentiation',
                priority: 'Medium',
                timeframe: '6-9 months'
              }
            ].map((step, index) => (
              <MDBox 
                key={index}
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                p={2} 
                mb={2}
                bgColor="white"
                borderRadius="lg"
                shadow="sm"
                border="1px solid #e0e0e0"
              >
                <MDBox flex="1">
                  <MDTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                    {step.title}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {step.description}
                  </MDTypography>
                </MDBox>
                <MDBox textAlign="right" ml={2}>
                  <Chip 
                    label={step.priority}
                    color={step.priority === 'High' ? 'error' : 'warning'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <MDTypography variant="body2" color="text">
                    {step.timeframe}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>
        </CardContent>
      </Card>
    </Container>
  );
}