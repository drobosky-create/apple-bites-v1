import React from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Text,
  Flex,
  StatsCard,
  designTokens
} from "@/design-system/components";
import { Box } from '@mui/material';
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
      <Container>
        <Flex direction="column" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Text variant="h6">Loading...</Text>
        </Flex>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <Flex direction="column" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Card variant="elevated">
            <CardBody>
              <Text variant="h6" color="error">
                Error loading user data
              </Text>
              <Text variant="body2" color="secondary">
                Please try refreshing the page or contact support.
              </Text>
            </CardBody>
          </Card>
        </Flex>
      </Container>
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
    <Container>
      {/* Header Card */}
      <Card variant="gradient" style={{ marginBottom: designTokens.spacing[8] }}>
        <Flex direction="row" align="center" justify="space-between">
          <Flex direction="row" align="center" gap={6}>
            <img 
              src="/apple-bites-logo.png" 
              alt="Apple Bites Business Assessment" 
              style={{ height: '48px', width: 'auto' }}
            />
            <Box>
              <Text variant="h4" style={{ color: 'white', fontWeight: designTokens.typography.fontWeight.bold }}>
                Welcome, {userData.firstName} {userData.lastName}
              </Text>
              <Text variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {userData.email}
              </Text>
              <Badge className="bg-white/20 text-white border-white/30 font-medium mt-2">
                {tierInfo.name}
              </Badge>
            </Box>
          </Flex>
          <Button 
            variant="secondary"
            onClick={() => logoutMutation.mutate()}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Logout
          </Button>
        </Flex>
      </Card>

      {/* Statistics Cards */}
      <Box style={{ marginBottom: designTokens.spacing[8] }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
          <StatsCard
            title="Account Status"
            value="Active"
            icon={<CheckCircle style={{ fontSize: '2rem' }} />}
            changeType="positive"
          />
          
          <StatsCard
            title="Assessment Tier"
            value={tierInfo.price}
            icon={<TierIcon style={{ fontSize: '2rem' }} />}
            changeType="neutral"
          />
          
          <StatsCard
            title="Reports Generated"
            value={userData.resultReady ? "1" : "0"}
            icon={<FileText style={{ fontSize: '2rem' }} />}
            changeType="neutral"
          />
          
          <StatsCard
            title="Business Value"
            value="$0"
            icon={<DollarSign style={{ fontSize: '2rem' }} />}
            changeType="neutral"
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Flex direction="column" gap={8}>
        {/* Assessment Status Card */}
        <Card variant="elevated">
          <CardHeader>
            <Text variant="h5" style={{ 
              color: designTokens.colors.primary[500], 
              fontWeight: designTokens.typography.fontWeight.bold 
            }}>
              Assessment Status
            </Text>
          </CardHeader>
          <CardBody>
            <Text variant="body2" color="secondary" style={{ marginBottom: designTokens.spacing[4] }}>
              Complete your business assessment to get your valuation report
            </Text>
            
            <Box style={{ marginTop: designTokens.spacing[4] }}>
              {userData.resultReady ? (
                <Flex direction="row" align="center" gap={3} style={{ marginBottom: designTokens.spacing[4] }}>
                  <CheckCircle style={{ color: designTokens.colors.success[500], fontSize: '1.25rem' }} />
                  <Text variant="body1" style={{ color: designTokens.colors.success[500], fontWeight: designTokens.typography.fontWeight.medium }}>
                    Assessment Complete - Results Ready
                  </Text>
                </Flex>
              ) : (
                <Flex direction="row" align="center" gap={3} style={{ marginBottom: designTokens.spacing[4] }}>
                  <Clock style={{ color: designTokens.colors.warning[500], fontSize: '1.25rem' }} />
                  <Text variant="body1" style={{ color: designTokens.colors.warning[500], fontWeight: designTokens.typography.fontWeight.medium }}>
                    Assessment Not Started
                  </Text>
                </Flex>
              )}
            </Box>
          </CardBody>
          <CardFooter>
            <Button 
              variant="primary"
              onClick={() => setLocation('/assessment/free')}
            >
              {userData.resultReady ? 'View Results' : 'Start Assessment'}
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
          <Card variant="elevated">
            <CardHeader>
              <Text variant="h6" style={{ color: designTokens.colors.success[500], fontWeight: designTokens.typography.fontWeight.bold }}>
                New Assessment
              </Text>
            </CardHeader>
            <CardBody>
              <Text variant="body2" color="secondary">
                Start a new business valuation assessment to get your updated report.
              </Text>
            </CardBody>
            <CardFooter>
              <Button 
                variant="success"
                onClick={() => setLocation('/assessment/free')}
              >
                <Target style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                New Assessment
              </Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <Text variant="h6" style={{ color: designTokens.colors.warning[500], fontWeight: designTokens.typography.fontWeight.bold }}>
                Upgrade Plan
              </Text>
            </CardHeader>
            <CardBody>
              <Text variant="body2" color="secondary">
                Upgrade to get industry-specific analysis and AI-powered insights.
              </Text>
            </CardBody>
            <CardFooter>
              <Button 
                variant="primary"
                onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                style={{ backgroundColor: designTokens.colors.warning[500] }}
              >
                <ExternalLink style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}