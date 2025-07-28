import InteractiveValuationSlider from "@/components/interactive-valuation-slider";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import type { ValuationAssessment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Container,
  Button,
  Avatar,
} from '@mui/material';
import { MDBox, MDTypography, MDButton } from "@/components/MD";
import { Link } from "wouter";
import { Home, FileText, TrendingUp, ExternalLink, User, Plus, BarChart3, Clock, Crown } from "lucide-react";
import { styled } from '@mui/material/styles';

// Material Dashboard Layout (matching dashboard.tsx exactly)
const DashboardBackground = styled(MDBox)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(MDBox)(({ theme }) => ({
  flex: 1,
  marginLeft: '328px', // Account for sidebar width (280px) + margins (24px * 2)
  backgroundColor: '#f8f9fa',
  padding: 4,
  minHeight: '100vh',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100vw',
    padding: '16px',
  },
}));

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  tier: 'free' | 'growth' | 'capital';
  resultReady: boolean;
}

export default function ValueCalculator() {
  const [, setLocation] = useLocation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  // Check if user has completed at least one assessment
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
  });

  const hasCompletedAssessment = assessments && assessments.length > 0;

  useEffect(() => {
    // If no assessments and not loading, redirect to valuation form
    if (!isLoading && !hasCompletedAssessment) {
      setLocation('/valuation-form');
    }
  }, [isLoading, hasCompletedAssessment, setLocation]);

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  if (authLoading || isLoading) {
    return (
      <DashboardBackground>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Box sx={{ 
            width: 40, 
            height: 40, 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #2152ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            }
          }} />
        </Box>
      </DashboardBackground>
    );
  }

  // Show access denied if no assessments found
  if (!hasCompletedAssessment) {
    return (
      <DashboardBackground>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
          <Box sx={{ 
            maxWidth: 400, 
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            p: 4,
            textAlign: 'center'
          }}>
            <Lock size={64} color="#67748e" style={{ marginBottom: 16 }} />
            <Typography variant="h4" sx={{ color: '#344767', fontWeight: 700, mb: 2 }}>
              Assessment Required
            </Typography>
            <Typography variant="body1" sx={{ color: '#67748e', mb: 3 }}>
              You need to complete a business valuation assessment before accessing the value improvement calculator.
            </Typography>
            <Button 
              onClick={() => setLocation('/assessment/free')}
              variant="contained"
              startIcon={<ArrowLeft />}
              sx={{
                backgroundColor: '#0A1F44',
                '&:hover': {
                  backgroundColor: '#1a365d'
                }
              }}
            >
              Start Valuation Assessment
            </Button>
          </Box>
        </Box>
      </DashboardBackground>
    );
  }

  // Use actual user data or default to free tier
  const displayUser: User = (user as User) || {
    id: "demo-user",
    email: "demo@applebites.ai",
    firstName: "Demo",
    lastName: "User", 
    profileImageUrl: "/default-avatar.png",
    tier: 'free' as const,
    resultReady: false
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return {
          name: 'Growth & Exit Assessment',
          color: 'primary',
          description: 'Professional industry-specific analysis with AI insights',
          price: '$795',
        };
      case 'capital':
        return {
          name: 'Capital Readiness Assessment',
          color: 'secondary',
          description: 'Comprehensive capital readiness analysis and strategic planning',
          price: '$2,500',
        };
      default:
        return {
          name: 'Free Assessment',
          color: 'default',
          description: 'Basic business valuation analysis',
          price: 'Free',
        };
    }
  };

  const tierInfo = getTierInfo(displayUser.tier);

  return (
    <DashboardBackground>
      {/* Correct Single MDBox Sidebar */}
      <MDBox
        sx={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          width: 280,
          height: 'calc(100vh - 48px)',
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}
      >
        {/* User Info Section */}
        <MDBox mb={4}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              {displayUser.firstName?.charAt(0) || 'D'}{displayUser.lastName?.charAt(0) || 'U'}
            </Avatar>
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
                {displayUser.firstName} {displayUser.lastName}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#5EEAD4' }}>
                {displayUser.email}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
              Tier:
            </MDTypography>
            <MDBox
              sx={{
                background: tierInfo.name === 'Free' 
                  ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
                  : tierInfo.name === 'Growth' 
                  ? 'linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)'
                  : 'linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {tierInfo.name.toUpperCase()}
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Navigation Buttons */}
        <MDBox display="flex" flexDirection="column" gap={2}>
          <Link href="/assessment/free">
            <MDButton
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#dbdce1',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Plus size={18} />}
            >
              New Assessment
            </MDButton>
          </Link>

          {/* Value Calculator - Active */}
          <MDButton
            sx={{
              background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
              color: '#0A1F44',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0, 191, 166, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 24px rgba(0, 191, 166, 0.5)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5
            }}
            startIcon={<BarChart3 size={18} />}
          >
            Value Calculator
          </MDButton>

          {displayUser.tier === 'free' && (
            <MDButton
              sx={{
                background: 'transparent',
                border: '2px solid #5EEAD4',
                color: '#5EEAD4',
                '&:hover': {
                  background: '#5EEAD4',
                  color: '#0A1F44',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Crown size={18} />}
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
            >
              Upgrade Plan
            </MDButton>
          )}

          <Link href="/dashboard">
            <MDButton
              className="text-[#dbdce1]"
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#dbdce1',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<User size={18} />}
            >
              Dashboard
            </MDButton>
          </Link>

          <Link href="/past-assessments">
            <MDButton
              className="text-[#dbdce1]"
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#dbdce1',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Clock size={18} />}
            >
              Past Assessments
            </MDButton>
          </Link>
        </MDBox>

        {/* Spacer */}
        <MDBox flexGrow={1} />

        {/* Footer */}
        <MDBox mt={4} pt={2} borderTop="1px solid rgba(255, 255, 255, 0.2)">
          <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Box
              component="img"
              src="/assets/logos/apple-bites-meritage-logo.png"
              alt="Apple Bites by Meritage Partners"
              sx={{
                width: 250,
                height: 250,
                objectFit: 'contain',
                maxWidth: '100%'
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Main Content - Compact Layout */}
      <MainContent>
        <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
          {/* Page Header - Compact */}
          <MDBox 
            sx={{ 
              mb: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <MDBox>
              <MDTypography variant="h6" sx={{ 
                color: '#344767', 
                fontWeight: 600,
                mb: 0.25,
                fontSize: '1.125rem'
              }}>
                Value Improvement Calculator
              </MDTypography>
              <MDTypography variant="body2" sx={{ 
                color: '#67748e',
                fontSize: '0.875rem'
              }}>
                Explore how improving your operational grades affects your business valuation
              </MDTypography>
            </MDBox>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => setLocation('/dashboard')}
              sx={{
                borderColor: '#0A1F44',
                color: '#0A1F44',
                px: 1.5,
                py: 0.75,
                fontSize: '0.75rem',
                borderRadius: '6px',
                '&:hover': {
                  borderColor: '#0A1F44',
                  backgroundColor: 'rgba(10, 31, 68, 0.05)'
                }
              }}
            >
              BACK TO DASHBOARD
            </Button>
          </MDBox>

          {/* Main Calculator Container - Scaled Down */}
          <MDBox sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            p: 2
          }}>
            <MDBox sx={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
              <InteractiveValuationSlider />
            </MDBox>
          </MDBox>
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}