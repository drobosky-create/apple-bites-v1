import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, FileText, TrendingUp, ExternalLink, LogOut } from "lucide-react";
import ValuationResults from "@/components/valuation-results";
import type { ValuationAssessment } from "@shared/schema";
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
} from '@mui/material';
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
  padding: '16px 24px 24px 8px',
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

export default function AssessmentResults() {
  const [, params] = useRoute("/assessment-results/:id");
  const [, setLocation] = useLocation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  const assessmentId = params?.id;

  // Fetch all assessments to find the specific one
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: !!assessmentId,
  });

  // Find the specific assessment
  const assessment = assessments?.find(a => a.id.toString() === assessmentId);

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  if (authLoading || assessmentsLoading) {
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

  if (!assessment) {
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
            <FileText size={64} color="#67748e" style={{ marginBottom: 16 }} />
            <Typography variant="h4" sx={{ color: '#344767', fontWeight: 700, mb: 2 }}>
              Assessment Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: '#67748e', mb: 3 }}>
              The requested assessment could not be found or you don't have access to it.
            </Typography>
            <Button 
              onClick={() => setLocation('/value-calculator')}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Value Calculator
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
              background: 'rgba(11, 20, 38, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
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
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Box component="img"
            src="/assets/logos/apple-bites-logo-variant-3.png"
            alt="Apple Bites Business Assessment"
            sx={{
              width: '80%',
              maxWidth: 200,
              mt: 1,
              mb: 1,
              mx: 'auto',
              display: 'block',
            }}
          />
          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            {displayUser.firstName} {displayUser.lastName}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
            {displayUser.email}
          </Typography>
          <Chip 
            label={tierInfo.name}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.75rem',
              mt: 1
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 2 }} />

        <List sx={{ px: 2 }}>
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
              onClick={() => setLocation('/value-calculator')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <TrendingUp size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Value Calculator" 
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
                <FileText size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Assessment Results" 
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
        <Container maxWidth="xl" sx={{ py: 0 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ 
                color: '#344767', 
                fontWeight: 700,
                mb: 1
              }}>
                Assessment Results
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#67748e', 
                fontWeight: 400
              }}>
                {assessment.firstName} {assessment.lastName} - {new Date(assessment.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Button
              onClick={() => setLocation('/value-calculator')}
              className="bg-gray-500 text-white hover:bg-gray-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculator
            </Button>
          </Box>

          {/* Assessment Results Container */}
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <ValuationResults results={assessment} />
          </Box>
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}