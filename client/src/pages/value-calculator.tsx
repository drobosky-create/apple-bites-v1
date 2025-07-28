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
import Sidebar from "@/components/Sidebar";
import { styled } from '@mui/material/styles';

// Material Dashboard Layout (matching dashboard.tsx exactly)
const DashboardLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '24px',
  marginLeft: '280px', // Sidebar width
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
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
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  // Show access denied if no assessments found
  if (!hasCompletedAssessment) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
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
    <DashboardLayout>
      {/* Use Shared Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <MainContent>
        <Container maxWidth="xl" sx={{ py: 0, px: 0 }}>
          {/* Page Header */}
          <MDBox 
            sx={{ 
              mb: 3, 
              p: 4,
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            p: 3
          }}>
            <InteractiveValuationSlider />
          </MDBox>
        </Container>
      </MainContent>
    </DashboardLayout>
  );
}