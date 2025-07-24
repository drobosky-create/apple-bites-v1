import React from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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
  DollarSign,
  Users,
  BarChart3,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
// Material Dashboard styling applied directly

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  tier: 'free' | 'growth' | 'capital';
  resultReady: boolean;
}

export default function UserDashboard() {
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
      <MaterialBackground>
        <MaterialContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography variant="h6">Loading...</Typography>
          </Box>
        </MaterialContainer>
      </MaterialBackground>
    );
  }

  if (error || !user) {
    return (
      <MaterialBackground>
        <MaterialContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <MaterialCard>
              <MaterialCardBody>
                <Typography variant="h6" color="error">
                  Error loading user data
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Please try refreshing the page or contact support.
                </Typography>
              </MaterialCardBody>
            </MaterialCard>
          </Box>
        </MaterialContainer>
      </MaterialBackground>
    );
  }

  const userData = user as User;
  
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return { name: 'Growth & Exit Assessment', price: '$795', icon: TrendingUp, color: 'primary' };
      case 'capital':
        return { name: 'Capital Access Assessment', price: '$1,495', icon: Crown, color: 'warning' };
      default:
        return { name: 'Free Assessment', price: 'Free', icon: Target, color: 'info' };
    }
  };

  const tierInfo = getTierInfo(userData.tier);
  const TierIcon = tierInfo.icon;

  return (
    <MaterialBackground>
      <MaterialContainer>
          {/* Header Card */}
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
                      Welcome, {userData.firstName} {userData.lastName}
                    </Typography>
                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {userData.email}
                    </Typography>
                    <Badge className="bg-white/20 text-white border-white/30 font-medium">
                      {tierInfo.name}
                    </Badge>
                  </Box>
                </Box>
                <MaterialButton 
                  color="white"
                  simple
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Logout
                </MaterialButton>
              </Box>
            </MaterialCardHeader>
          </MaterialCard>

          {/* Statistics Cards */}
          <Box mt={3} mb={3}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
              <MaterialStatsCard
                title="Account Status"
                value="Active"
                icon={<CheckCircle style={{ fontSize: '2rem' }} />}
                color="success"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    Account in good standing
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Assessment Tier"
                value={tierInfo.price}
                icon={<TierIcon style={{ fontSize: '2rem' }} />}
                color={tierInfo.color as any}
                footer={
                  <Typography variant="body2" color="textSecondary">
                    {tierInfo.name}
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Reports Generated"
                value={userData.resultReady ? "1" : "0"}
                icon={<FileText style={{ fontSize: '2rem' }} />}
                color="info"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    {userData.resultReady ? "Report ready" : "No reports yet"}
                  </Typography>
                }
              />
              
              <MaterialStatsCard
                title="Business Value"
                value="$0"
                icon={<DollarSign style={{ fontSize: '2rem' }} />}
                color="warning"
                footer={
                  <Typography variant="body2" color="textSecondary">
                    Complete assessment for value
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Main Content */}
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
                  Complete your business assessment to get your valuation report
                </Typography>
                
                <Box mt={2}>
                  {userData.resultReady ? (
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <CheckCircle style={{ color: '#4caf50', fontSize: '1.25rem' }} />
                      <Typography variant="body1" color="success.main" fontWeight="medium">
                        Assessment Complete - Results Ready
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Clock style={{ color: '#ff9800', fontSize: '1.25rem' }} />
                      <Typography variant="body1" color="warning.main" fontWeight="medium">
                        Assessment Not Started
                      </Typography>
                    </Box>
                  )}
                </Box>
              </MaterialCardBody>
              <MaterialCardFooter>
                <MaterialButton 
                  color="primary"
                  onClick={() => setLocation('/assessment/free')}
                >
                  {userData.resultReady ? 'View Results' : 'Start Assessment'}
                </MaterialButton>
              </MaterialCardFooter>
            </MaterialCard>

            {/* Quick Actions */}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
              <MaterialCard>
                <MaterialCardHeader color="success">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    New Assessment
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" color="textSecondary">
                    Start a new business valuation assessment to get your updated report.
                  </Typography>
                </MaterialCardBody>
                <MaterialCardFooter>
                  <MaterialButton 
                    color="success"
                    onClick={() => setLocation('/assessment/free')}
                  >
                    <Target style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    New Assessment
                  </MaterialButton>
                </MaterialCardFooter>
              </MaterialCard>

              <MaterialCard>
                <MaterialCardHeader color="warning">
                  <Typography variant="h6" style={{ color: 'white' }}>
                    Upgrade Plan
                  </Typography>
                </MaterialCardHeader>
                <MaterialCardBody>
                  <Typography variant="body2" color="textSecondary">
                    Upgrade to get industry-specific analysis and AI-powered insights.
                  </Typography>
                </MaterialCardBody>
                <MaterialCardFooter>
                  <MaterialButton 
                    color="warning"
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                  >
                    <ExternalLink style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    Upgrade Plan
                  </MaterialButton>
                </MaterialCardFooter>
              </MaterialCard>
            </Box>
          </Box>
        </MaterialContainer>
    </MaterialBackground>
  );
}