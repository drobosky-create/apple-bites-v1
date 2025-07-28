import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDAvatar from '@/components/MD/MDAvatar';
import MDBadge from '@/components/MD/MDBadge';
import { AppleBitesLogo } from '@/components/AppleBitesLogo';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink,
  Eye,
  Calendar
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Chip } from '@mui/material';

interface DashboardUser {
  name: string;
  email: string;
  tier: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
}

// Assessment interface for dashboard
interface Assessment {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  adjustedEbitda: string;
  midEstimate: string;
  lowEstimate: string;
  highEstimate: string;
  valuationMultiple: string;
  overallScore: string;
  tier: string;
  reportTier: string;
  createdAt: string;
  pdfUrl?: string;
  isProcessed: boolean;
  executiveSummary?: string;
}

// Mock user data - replace with actual auth data
const mockUser: DashboardUser = {
  name: 'Demo User',
  email: 'demo@applebites.ai',
  tier: 'free',
  firstName: 'Demo',
  lastName: 'User'
};

// Past Assessments Component for Dashboard
function PastAssessmentsSection() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    const numValue = parseFloat(value);
    
    if (numValue >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(numValue);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "#4CAF50";
      case "B": return "#8BC34A";
      case "C": return "#FF9800";
      case "D": return "#FF5722";
      case "F": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  return (
    <MDBox
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Past Assessments
        </MDTypography>
        <Link href="/past-assessments">
          <MDButton variant="text" color="primary" size="small">
            View All
          </MDButton>
        </Link>
      </MDBox>
      
      {isLoading ? (
        <MDBox sx={{ textAlign: 'center', py: 3 }}>
          <MDTypography variant="body2" color="text">
            Loading assessments...
          </MDTypography>
        </MDBox>
      ) : !assessments || assessments.length === 0 ? (
        <MDBox
          sx={{
            textAlign: 'center',
            py: 6,
            borderRadius: 1,
            backgroundColor: '#f8f9fa',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f0f2f5',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <MDBox
            sx={{
              display: 'inline-block',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 }
              }
            }}
          >
            <Clock size={48} color="#9e9e9e" style={{ marginBottom: 16 }} />
          </MDBox>
          <MDTypography variant="h6" color="text" mb={1}>
            No assessments yet
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Your completed assessments will appear here. Start your first assessment to see your business valuation.
          </MDTypography>
          <MDBox display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Link href="/assessment/free">
              <MDButton variant="gradient" color="primary">
                Start Assessment
              </MDButton>
            </Link>
          </MDBox>
        </MDBox>
      ) : (
        <MDBox display="flex" flexDirection="column" gap={2}>
          {assessments.slice(0, 3).map((assessment) => (
            <Card key={assessment.id} sx={{ cursor: 'pointer' }}>
              <CardContent sx={{ p: 2 }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <MDBox>
                    <MDTypography variant="h6" fontWeight="medium" color="dark" mb={0.5}>
                      {assessment.company || 'Your Business'}
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Calendar size={12} color="#666" />
                      <Typography variant="body2" color="textSecondary" fontSize="12px">
                        {formatDate(assessment.createdAt || '')}
                      </Typography>
                    </MDBox>
                  </MDBox>
                  
                  <Chip 
                    label={assessment.tier?.toUpperCase() || 'FREE'} 
                    size="small" 
                    color="default"
                    sx={{ fontWeight: 'medium', fontSize: '10px' }}
                  />
                </MDBox>

                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox>
                    <Typography variant="body2" color="textSecondary" fontSize="11px">Valuation</Typography>
                    <Typography variant="h6" fontWeight="medium" fontSize="14px">
                      {formatCurrency(assessment.midEstimate)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox textAlign="center">
                    <Typography variant="body2" color="textSecondary" fontSize="11px">EBITDA</Typography>
                    <Typography variant="body2" fontWeight="medium" fontSize="12px">
                      {formatCurrency(assessment.adjustedEbitda)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox textAlign="center">
                    <Typography variant="body2" color="textSecondary" fontSize="11px">Grade</Typography>
                    <MDBox
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: getGradeColor(assessment.overallScore || 'C'),
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        margin: '0 auto'
                      }}
                    >
                      {assessment.overallScore}
                    </MDBox>
                  </MDBox>

                  <MDButton 
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<Eye size={14} />}
                  >
                    View
                  </MDButton>
                </MDBox>
              </CardContent>
            </Card>
          ))}
        </MDBox>
      )}
    </MDBox>
  );
}

function DashboardSidebar({ user }: { user: DashboardUser }) {
  // Apple Bites Brand Colors
  const colors = {
    primary: "#00BFA6",
    secondary: "#0A1F44", 
    accent: "#5EEAD4",
    grayLight: "#F7FAFC",
    gray: "#CBD5E1"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)",
    dark: "linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)",
    glow: "linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)"
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return colors.gray;
      case 'growth': return colors.primary;
      case 'capital': return colors.accent;
      default: return colors.gray;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'free': return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
      case 'growth': return gradients.primary;
      case 'capital': return gradients.glow;
      default: return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  return (
    <MDBox
      sx={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        width: 280,
        height: 'calc(100vh - 48px)',
        background: gradients.dark,
        borderRadius: '20px',
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden' // Prevent internal scrolling
      }}
    >
      {/* User Info Section */}
      <MDBox mb={4}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <MDAvatar
            sx={{
              background: gradients.glow,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <User size={24} color="white" />
          </MDAvatar>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
              {user.name}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              {user.email}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
            Tier:
          </MDTypography>
          <MDBox
            sx={{
              background: getTierGradient(user.tier),
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
            {getTierLabel(user.tier)}
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Navigation Buttons */}
      <MDBox display="flex" flexDirection="column" gap={2}>
        <Link href="/assessment/free">
          <MDButton
            sx={{
              background: gradients.glow,
              color: 'white',
              '&:hover': {
                background: gradients.light,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px -8px ${colors.primary}`
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

        {user.tier === 'free' && (
          <MDButton
            sx={{
              background: 'transparent',
              border: `2px solid ${colors.accent}`,
              color: colors.accent,
              '&:hover': {
                background: colors.accent,
                color: colors.secondary,
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

        <Link href="/profile">
          <MDButton
            className="text-[#dbdce1]"
            sx={{
              background: 'transparent',
              border: `1px solid rgba(255, 255, 255, 0.3)`,
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
            My Profile
          </MDButton>
        </Link>

        <Link href="/past-assessments">
          <MDButton
            className="text-[#dbdce1]"
            sx={{
              background: 'transparent',
              border: `1px solid rgba(255, 255, 255, 0.3)`,
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
      <MDBox mt={4} pt={2} borderTop={`1px solid rgba(255, 255, 255, 0.2)`}>
        <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites by Meritage Partners"
            width={250}
            height={250}
            style={{
              objectFit: 'contain',
              maxWidth: '100%'
            }}
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

function DashboardMainContent({ user, setupDemoSession }: { user: DashboardUser; setupDemoSession: () => void }) {
  // Apple Bites Brand Colors
  const colors = {
    primary: "#00BFA6",
    secondary: "#0A1F44", 
    accent: "#5EEAD4",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)",
    glow: "linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)"
  };

  const getDashboardTitle = (tier: string) => {
    switch (tier) {
      case 'free': return 'Your Free Assessment Dashboard';
      case 'growth': return 'Your Growth Plan Dashboard';
      case 'capital': return 'Your Capital Readiness Dashboard';
      default: return 'Your Dashboard';
    }
  };

  return (
    <MDBox
      sx={{
        flex: 1,
        marginLeft: '328px', // Account for pillbox sidebar width + margins
        backgroundColor: colors.grayLight,
        padding: 4,
        minHeight: '100vh',
        overflow: 'auto'
      }}
    >
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" mb={1} sx={{ color: colors.secondary }}>
          {getDashboardTitle(user.tier)}
        </MDTypography>
        <MDTypography variant="body1" sx={{ color: colors.secondary, opacity: 0.7 }}>
          Manage your business valuation assessments and track your progress.
        </MDTypography>
      </MDBox>

      {/* Status Widget */}
      <MDBox
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 3,
          mb: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={1}>
              Assessment Status
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {user.tier === 'free' 
                ? 'Ready to start your free business valuation assessment'
                : 'Access your premium assessment tools and reports'
              }
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Quick Actions Grid */}
      <MDBox display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3} mb={4}>
        {/* New Assessment Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 200
          }}
        >
          <MDBox display="flex" alignItems="center" mb={2}>
            <MDBox
              sx={{
                background: gradients.light,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <FileText size={24} color="white" />
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              New Assessment
            </MDTypography>
          </MDBox>
          <MDBox flexGrow={1}>
            <MDTypography variant="body2" color="text" mb={3}>
              Create a new business valuation assessment to get insights into your company's worth.
            </MDTypography>
          </MDBox>
          <Link href="/assessment/free">
            <MDButton 
              sx={{
                background: gradients.primary,
                color: 'white',
                '&:hover': {
                  background: gradients.glow,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px -8px ${colors.primary}`
                },
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              Get Started
            </MDButton>
          </Link>
        </MDBox>

        {/* Upgrade/Report Card - Only show upgrade for free users */}
        {user.tier === 'free' ? (
          <MDBox
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 200
            }}
          >
            <MDBox display="flex" alignItems="center" mb={2}>
              <MDBox
                sx={{
                  backgroundColor: '#fff3e0',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Crown size={24} color="#ff9800" />
              </MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                Upgrade Plan
              </MDTypography>
            </MDBox>
            <MDBox flexGrow={1}>
              <MDTypography variant="body2" color="text" mb={3}>
                Unlock premium features including detailed industry analysis and AI-powered insights.
              </MDTypography>
            </MDBox>
            <MDButton 
              variant="gradient" 
              color="warning" 
              fullWidth
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              endIcon={<ExternalLink size={16} />}
            >
              Upgrade Now
            </MDButton>
          </MDBox>
        ) : (
          <MDBox
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 200
            }}
          >
            <MDBox display="flex" alignItems="center" mb={2}>
              <MDBox
                sx={{
                  backgroundColor: '#e8f5e8',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <BarChart3 size={24} color="#4caf50" />
              </MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                View Reports
              </MDTypography>
            </MDBox>
            <MDBox flexGrow={1}>
              <MDTypography variant="body2" color="text" mb={3}>
                Access your detailed valuation reports and premium analytics.
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="success" fullWidth>
              View Reports
            </MDButton>
          </MDBox>
        )}
      </MDBox>

      {/* Past Assessments */}
      <PastAssessmentsSection />
    </MDBox>
  );
}

export default function DashboardClean() {
  const { user, isAuthenticated } = useAuth();
  
  // Use actual user data or fallback to mock for testing
  const displayUser = (user as DashboardUser) || mockUser;

  // Function to setup demo session for testing
  const setupDemoSession = async () => {
    try {
      const response = await fetch('/api/setup-demo', {
        method: 'GET',
        credentials: 'include', // Include cookies for session
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Demo session created:', result);
        
        // Force React Query to refetch user data
        setTimeout(() => {
          window.location.reload(); // Reload to pick up the new session
        }, 100);
      } else {
        console.error('Failed to setup demo session');
      }
    } catch (error) {
      console.error('Failed to setup demo session:', error);
    }
  };

  return (
    <MDBox display="flex" minHeight="100vh">
      <DashboardSidebar user={displayUser} />
      <DashboardMainContent user={displayUser} setupDemoSession={setupDemoSession} />
    </MDBox>
  );
}