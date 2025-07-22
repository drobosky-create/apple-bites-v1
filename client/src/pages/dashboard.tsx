import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  FileText, 
  LogOut,
  TrendingUp,
  Crown,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

// Material Dashboard Styled Components
const DashboardBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
}));

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)',
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
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

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user: authUser, isLoading: authLoading } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      window.location.href = '/api/logout';
    },
    onSuccess: () => {
      toast({
        title: "Logging out...",
        description: "You are being logged out of your account.",
      });
    },
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

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return {
          name: 'Growth & Exit Assessment',
          icon: TrendingUp,
          color: 'primary',
          description: 'Professional industry-specific analysis with AI insights',
          price: '$795',
        };
      case 'capital':
        return {
          name: 'Capital Readiness Assessment',
          icon: Crown,
          color: 'secondary',
          description: 'Comprehensive capital readiness analysis and strategic planning',
          price: '$2,500',
        };
      default:
        return {
          name: 'Free Assessment',
          icon: FileText,
          color: 'default',
          description: 'Basic business valuation analysis',
          price: 'Free',
        };
    }
  };

  // Use actual user data or default to free tier
  const displayUser: User = user || {
    id: "demo-user",
    email: "demo@applebites.ai",
    firstName: "Demo",
    lastName: "User", 
    profileImageUrl: "/default-avatar.png",
    tier: 'free' as const,
    resultReady: false
  };

  const tierInfo = getTierInfo(displayUser.tier);
  const TierIcon = tierInfo.icon;

  return (
    <DashboardBackground>
      {/* Header */}
      <GradientAppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 2 }}>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={3}>
                <Box component="img"
                  src="/assets/logos/apple-bites-logo-3.png"
                  alt="Apple Bites Business Assessment"
                  sx={{ height: 50, width: 'auto' }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    Welcome, {displayUser.firstName} {displayUser.lastName}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    {displayUser.email}
                  </Typography>
                  <Chip 
                    label={tierInfo.name}
                    size="small"
                    sx={{ 
                      mt: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                </Box>
              </Box>
              <ActionButton
                variant="outlined"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  }
                }}
                startIcon={<LogOut size={18} />}
              >
                Logout
              </ActionButton>
            </Box>
          </Container>
        </Toolbar>
      </GradientAppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <WelcomeCard>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, #2152ff 0%, #21d4fd 100%)',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {displayUser.firstName?.[0]}{displayUser.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#344767" gutterBottom>
                  Your {tierInfo.name} Dashboard
                </Typography>
                <Typography variant="body1" color="#67748e" mb={2}>
                  {tierInfo.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TierIcon size={20} color="#2152ff" />
                  <Typography variant="h6" color="#344767" fontWeight="bold">
                    {tierInfo.price}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </WelcomeCard>

        {/* Dashboard Content */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Two Column Layout */}
          <Box display="flex" gap={3} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Assessment Status */}
            <Box sx={{ flex: 1 }}>
              <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <CheckCircle size={24} color={displayUser.resultReady ? "#4caf50" : "#ff9800"} />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Assessment Status
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="#67748e" mb={3}>
                    {displayUser.resultReady 
                      ? "Your assessment is complete and ready for download"
                      : "Complete your business assessment to get your valuation report"
                    }
                  </Typography>
                  <ActionButton
                    variant="contained"
                    fullWidth
                    onClick={() => setLocation('/assessment/free')}
                    sx={{
                      background: 'linear-gradient(135deg, #2152ff 0%, #21d4fd 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e4bff 0%, #1ecffa 100%)',
                      }
                    }}
                  >
                    {displayUser.resultReady ? "View Results" : "Start Assessment"}
                  </ActionButton>
                </CardContent>
              </StatCard>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ flex: 1 }}>
              <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <TierIcon size={24} color="#2152ff" />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Quick Actions
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <ActionButton
                      variant="outlined"
                      startIcon={<FileText size={18} />}
                      onClick={() => setLocation('/assessment/free')}
                      sx={{
                        borderColor: '#2152ff',
                        color: '#2152ff',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 82, 255, 0.04)',
                          borderColor: '#1e4bff',
                        }
                      }}
                    >
                      New Assessment
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      startIcon={<ExternalLink size={18} />}
                      onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                      sx={{
                        borderColor: '#67748e',
                        color: '#67748e',
                        '&:hover': {
                          backgroundColor: 'rgba(103, 116, 142, 0.04)',
                          borderColor: '#344767',
                        }
                      }}
                    >
                      Upgrade Plan
                    </ActionButton>
                  </Box>
                </CardContent>
              </StatCard>
            </Box>
          </Box>

          {/* Features Overview - Full Width */}
          <StatCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="#344767" mb={3}>
                What's Included in Your {tierInfo.name}
              </Typography>
              <Box display="flex" gap={3} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Box display="flex" alignItems="start" gap={2} sx={{ flex: 1 }}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      Basic Valuation Analysis
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      General EBITDA multipliers and financial assessment
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="start" gap={2} sx={{ flex: 1 }}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      Value Driver Scoring
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      A-F grade assessment across 10 key business factors
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="start" gap={2} sx={{ flex: 1 }}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      PDF Report Generation
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      Professional report with valuation range and insights
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Box>
      </Container>
    </DashboardBackground>
  );
}