import InteractiveValuationSlider from "@/components/interactive-valuation-slider";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

import { ArrowLeft, Lock, Home, FileText, TrendingUp, ExternalLink, LogOut } from "lucide-react";
import type { ValuationAssessment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import { styled } from '@mui/material/styles';

// Material Dashboard Styled Components (matching dashboard.tsx exactly)
const DashboardBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px',
  marginLeft: 0,
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
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
              
            >
              <ArrowLeft  />
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
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: 'url(/assets/twilight-city-skyline.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(11, 20, 38, 0.45)', // Even lighter overlay for better visibility
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)', // Safari support
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 1,
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          },
        }}
      >
        <MDBox sx={{ p: 2, textAlign: 'center' }}>
          <Box component="img"
            src="/assets/logos/apple-bites-logo-variant-3.png"
            alt="Apple Bites Business Assessment"
            sx={{
              width: '80%',        // Responsive width inside sidebar
              maxWidth: 200,
              mt: 1,
              mb: 1,
              mx: 'auto',
              display: 'block',
            }}
          />
          <MDTypography variant="h6" fontWeight="bold" color="white" gutterBottom>
            {displayUser.firstName} {displayUser.lastName}
          </MDTypography>
          <MDTypography variant="body2" color="white" sx={{ opacity: 0.7 }} gutterBottom>
            {displayUser.email}
          </MDTypography>
          <Chip 
            label={tierInfo.name}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </MDBox>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

        <List sx={{ px: 2, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setLocation('/dashboard')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Home size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setLocation('/assessment/free')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <FileText size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="New Assessment" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <TrendingUp size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Value Calculator" 
                primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <ExternalLink size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Upgrade Plan" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="caption" color="rgba(255,255,255,0.6)" textAlign="center" display="block">
            © 2025 Meritage Partners
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <MainContent>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {/* Page Header */}
          <Box sx={{ 
            mb: 4, 
            p: 4,
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                color: '#344767', 
                fontWeight: 700,
                mb: 1
              }}>
                Value Improvement Calculator
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#67748e', 
                fontWeight: 400
              }}>
                Explore how improving your operational grades affects your business valuation
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              onClick={() => setLocation('/dashboard')}
              sx={{
                borderColor: '#00BFA6',
                color: '#00BFA6',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(0, 191, 166, 0.1)',
                  borderColor: '#4DD0C7',
                }
              }}
            >
              BACK TO DASHBOARD
            </Button>
          </Box>

          {/* Main Calculator Container */}
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            p: 3
          }}>
            <InteractiveValuationSlider />
          </Box>
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}