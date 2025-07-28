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
  Chip,
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
      {/* Unified Dashboard Sidebar */}
      <MDBox
        width={drawerWidth}
        height="100vh"
        display={{ xs: 'none', md: 'flex' }}
        flexDirection="column"
        position="fixed"
        top={0}
        left={0}
        zIndex={1200}
        sx={{
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
        }}
      >
        {/* User Profile Section */}
        <MDBox p={3} textAlign="center">
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
              width: 64,
              height: 64,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              mx: 'auto',
              mb: 2
            }}
          >
            {displayUser.firstName?.charAt(0) || 'D'}{displayUser.lastName?.charAt(0) || 'U'}
          </Avatar>
          
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
            {displayUser.firstName} {displayUser.lastName}
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
            {displayUser.email}
          </Typography>
          
          <Chip
            label={tierInfo.name.toUpperCase()}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </MDBox>

        {/* Navigation Menu */}
        <MDBox flex={1} px={2}>
          {/* Dashboard */}
          <Link href="/dashboard">
            <Button
              fullWidth
              variant="text"
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                mb: 1,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <User size={20} style={{ marginRight: 12 }} />
              Dashboard
            </Button>
          </Link>

          {/* New Assessment */}
          <Link href="/assessment/free">
            <Button
              fullWidth
              variant="text"
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                mb: 1,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Plus size={20} style={{ marginRight: 12 }} />
              New Assessment
            </Button>
          </Link>

          {/* Value Calculator - Active */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              mb: 1,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
              color: '#0A1F44',
              boxShadow: '0 4px 20px rgba(0, 191, 166, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
                boxShadow: '0 6px 24px rgba(0, 191, 166, 0.5)'
              }
            }}
          >
            <BarChart3 size={20} style={{ marginRight: 12 }} />
            Value Calculator
          </Button>

          {/* Past Assessments */}
          <Link href="/past-assessments">
            <Button
              fullWidth
              variant="text"
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                mb: 1,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Clock size={20} style={{ marginRight: 12 }} />
              Past Assessments
            </Button>
          </Link>

          {/* Upgrade Plan */}
          <Button
            fullWidth
            variant="text"
            onClick={() => window.open('https://products.applebites.ai/', '_blank')}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              mb: 1,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <Crown size={20} style={{ marginRight: 12 }} />
            Upgrade Plan
          </Button>
        </MDBox>

        {/* Apple Bites Branding */}
        <MDBox p={3} textAlign="center" borderTop="1px solid rgba(255,255,255,0.1)">
          <Box component="img"
            src="/assets/logos/apple-bites-logo-variant-3.png"
            alt="Apple Bites"
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2,
              display: 'block',
            }}
          />
          <Typography variant="h6" sx={{ color: '#00BFA6', fontWeight: 'bold', mb: 0.5 }}>
            APPLE BITES
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Business Assessment Platform
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
            © 2025 Meritage Partners
          </Typography>
        </MDBox>
      </MDBox>

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