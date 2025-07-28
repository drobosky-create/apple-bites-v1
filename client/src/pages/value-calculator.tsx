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
} from '@mui/material';
import { MDBox, MDTypography } from "@/components/MD";
import { Home, FileText, TrendingUp, ExternalLink } from "lucide-react";
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
  flexGrow: 1,
  padding: '16px 24px 24px 8px',
  marginLeft: 0,
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
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
      {/* Clean Simple Sidebar - Match Reference Image */}
      <Box sx={{
        width: drawerWidth,
        height: '100vh',
        backgroundColor: '#1e3a8a', // Deep blue background
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        p: 3,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}>
        {/* User Profile Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#00d4aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {displayUser.firstName?.charAt(0) || 'D'}{displayUser.lastName?.charAt(0) || 'U'}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
            {displayUser.firstName} {displayUser.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
            {displayUser.email}
          </Typography>
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: '16px',
            display: 'inline-block',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            Tier: {tierInfo.name.toUpperCase()}
          </Box>
        </Box>

        {/* Navigation Buttons - Match Reference Image Order */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Dashboard - Clean Button */}
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              py: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              px: 3,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            startIcon={<Home size={20} />}
          >
            Dashboard
          </Button>

          {/* New Assessment - Clean Button */}
          <Button
            onClick={() => setLocation('/assessment/free')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              py: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              px: 3,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            startIcon={<FileText size={20} />}
          >
            New Assessment
          </Button>

          {/* Value Calculator - Active/Selected */}
          <Button
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              py: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              justifyContent: 'flex-start',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)'
              }
            }}
            startIcon={<TrendingUp size={20} />}
          >
            Value Calculator
          </Button>

          {/* Past Assessments */}
          <Button
            onClick={() => setLocation('/past-assessments')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              py: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              px: 3,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            startIcon={<FileText size={20} />}
          >
            Past Assessments
          </Button>

          {/* Upgrade Plan */}
          <Button
            onClick={() => window.open('https://products.applebites.ai/', '_blank')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              py: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              px: 3,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            startIcon={<ExternalLink size={20} />}
          >
            Upgrade Plan
          </Button>
        </Box>

        {/* Logo Section at Bottom */}
        <Box sx={{ mt: 'auto', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ 
            color: '#00d4aa', 
            fontWeight: 'bold',
            mb: 1,
            fontSize: '1.1rem'
          }}>
            MERITAGE
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#00d4aa',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            mb: 2
          }}>
            PARTNERS
          </Typography>
          
          {/* Apple with Money Icon */}
          <Box sx={{ mb: 2 }}>
            <Box component="img"
              src="/assets/logos/apple-bites-logo-variant-3.png"
              alt="Apple Bites"
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                display: 'block',
              }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ 
            color: '#00d4aa', 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            APPLE BITES
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#00d4aa',
            fontWeight: 'bold',
            letterSpacing: '0.05em'
          }}>
            BUSINESS ASSESSMENT
          </Typography>
        </Box>
      </Box>

      {/* Main Content - Match Reference Layout */}
      <MainContent>
        <Container maxWidth="xl" sx={{ py: 4, px: 4 }}>
          {/* Page Header - Clean and Simple */}
          <MDBox 
            sx={{ 
              mb: 3,
              p: 3,
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <MDBox>
              <MDTypography variant="h4" sx={{ 
                color: '#344767', 
                fontWeight: 700,
                mb: 1
              }}>
                Value Improvement Calculator
              </MDTypography>
              <MDTypography variant="h6" sx={{ 
                color: '#67748e', 
                fontWeight: 400
              }}>
                Explore how improving your operational grades affects your business valuation
              </MDTypography>
            </MDBox>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              onClick={() => setLocation('/dashboard')}
              sx={{
                borderColor: '#0A1F44',
                color: '#0A1F44',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#0A1F44',
                  backgroundColor: 'rgba(10, 31, 68, 0.04)'
                }
              }}
            >
              BACK TO DASHBOARD
            </Button>
          </MDBox>

          {/* Main Calculator Container */}
          <MDBox sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            p: 3
          }}>
            <InteractiveValuationSlider />
          </MDBox>
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}