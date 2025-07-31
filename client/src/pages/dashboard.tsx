import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDAvatar from '@/components/MD/MDAvatar';
import MobileDashboard from '@/components/MobileDashboard';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink,
  Eye,
  Calendar,
  LogOut,
  Check,
  Lock,
  Star,
  TrendingUp
} from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface DashboardUser {
  id?: string;
  email: string;
  tier: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
  name?: string; // For backwards compatibility with mock data
  authProvider?: string;
}

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

// Past Assessments Component
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

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <MDTypography variant="body2" color="text">
          Loading recent assessments...
        </MDTypography>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <FileText size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <MDTypography variant="h6" fontWeight="medium" color="text" mb={1}>
          No Assessments Yet
        </MDTypography>
        <MDTypography variant="body2" color="text" mb={3}>
          Complete your first business valuation to see results here
        </MDTypography>
        <Link href="/assessment/free">
          <MDButton
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
              color: 'white',
              py: 1.5,
              px: 3
            }}
            startIcon={<Plus size={18} />}
          >
            Start First Assessment
          </MDButton>
        </Link>
      </Card>
    );
  }

  return (
    <MDBox display="flex" flexDirection="column" gap={2}>
      {assessments.slice(0, 3).map((assessment) => (
        <Card key={assessment.id} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" alignItems="center" gap={2}>
              <MDBox
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${getGradeColor(assessment.overallScore)} 20%, ${getGradeColor(assessment.overallScore)}40 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MDTypography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                  {assessment.overallScore}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium" color="text">
                  {assessment.company || `${assessment.firstName} ${assessment.lastName}`}
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                  {formatDate(assessment.createdAt)} • {formatCurrency(assessment.midEstimate)} valuation
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Chip 
                label={assessment.tier.toUpperCase()} 
                size="small" 
                sx={{ 
                  backgroundColor: assessment.tier === 'free' ? '#E5E7EB' : '#00718d',
                  color: assessment.tier === 'free' ? '#6B7280' : 'white',
                  fontSize: '0.75rem'
                }} 
              />
              <MDButton
                sx={{
                  minWidth: 'auto',
                  p: 1,
                  color: '#6B7280',
                  '&:hover': { color: '#00718d' }
                }}
              >
                <Eye size={16} />
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
      ))}
      
      {assessments.length > 3 && (
        <Link href="/past-assessments">
          <MDButton
            sx={{
              background: 'transparent',
              border: '1px solid #D1D5DB',
              color: '#6B7280',
              py: 1.5,
              width: '100%',
              '&:hover': {
                background: '#F9FAFB',
                borderColor: '#00718d',
                color: '#00718d'
              }
            }}
            startIcon={<BarChart3 size={18} />}
          >
            View All Assessments ({assessments.length})
          </MDButton>
        </Link>
      )}
    </MDBox>
  );
}

// Responsive Dashboard with Mobile/Desktop Views
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  // Temporarily disable mobile detection to test dashboard
  const isMobile = false;
  
  // Debug logging
  console.log('Dashboard - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Please log in to access dashboard</div>
      </div>
    );
  }
  
  // Use actual user data or fallback to mock for testing
  const displayUser = (user as DashboardUser) || mockUser;

  const handleSignOut = async () => {
    try {
      await fetch('/api/logout', { credentials: 'include' });
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      queryClient.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      queryClient.clear();
      window.location.href = '/';
    }
  };

  // Return mobile version for small screens
  if (isMobile) {
    console.log('Rendering MobileDashboard component');
    return <MobileDashboard user={displayUser} onSignOut={handleSignOut} />;
  }
  
  console.log('Rendering Desktop dashboard');

  // Desktop version with clean layout (no problematic sidebar)
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
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

  // Desktop Layout with Sidebar
  return (
    <MDBox sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <MDBox
        sx={{
          width: 280,
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* Logo Section */}
        <MDBox sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites Business Assessment"
            style={{
              width: '80%',
              maxWidth: 200,
              height: 'auto',
              marginBottom: 16
            }}
          />
          <MDTypography variant="h6" sx={{ color: '#81e5d8', fontWeight: 300 }}>
            Business Valuation Platform
          </MDTypography>
        </MDBox>

        {/* User Info */}
        <MDBox sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              <User size={20} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#81e5d8' }}>
                {getTierLabel(displayUser.tier)} Plan
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Navigation */}
        <MDBox sx={{ flex: 1, p: 2 }}>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <Link href="/assessment/free">
              <MDButton
                sx={{
                  background: gradients.glow,
                  color: 'white',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start'
                }}
                startIcon={<FileText size={18} />}
              >
                Free Assessment
              </MDButton>
            </Link>
            
            {displayUser.tier === 'free' ? (
              <Link href="/pricing">
                <MDButton
                  sx={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#dbdce1',
                    width: '100%',
                    py: 1.5,
                    justifyContent: 'flex-start',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<Crown size={18} />}
                >
                  Growth Assessment
                </MDButton>
              </Link>
            ) : (
              <Link href="/assessment/paid">
                <MDButton
                  sx={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#dbdce1',
                    width: '100%',
                    py: 1.5,
                    justifyContent: 'flex-start',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<Crown size={18} />}
                >
                  Growth Assessment
                </MDButton>
              </Link>
            )}
            
            <Link href="/past-assessments">
              <MDButton
                sx={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#dbdce1',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
                startIcon={<BarChart3 size={18} />}
              >
                Past Assessments
              </MDButton>
            </Link>
            
            <MDButton
              component="a"
              href="https://api.leadconnectorhq.com/widget/bookings/applebites"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#dbdce1',
                width: '100%',
                py: 1.5,
                justifyContent: 'flex-start',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={<Calendar size={18} />}
            >
              Schedule Consultation
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Sign Out */}
        <MDBox sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <MDButton
            onClick={handleSignOut}
            sx={{
              background: 'transparent',
              border: '1px solid #EF4444',
              color: '#EF4444',
              width: '100%',
              py: 1.5
            }}
            startIcon={<LogOut size={18} />}
          >
            Sign Out
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Main Content */}
      <MDBox sx={{ flexGrow: 1, marginLeft: '280px', p: 3 }}>
        {/* Welcome Header */}
        <MDBox mb={4}>
          <MDTypography variant="h3" fontWeight="medium" color="text" mb={1}>
            Welcome back, {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}!
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Ready to unlock your business potential? Start with a comprehensive valuation assessment.
          </MDTypography>
        </MDBox>

        {/* Quick Stats Cards */}
        <MDBox display="flex" gap={3} mb={4}>
          <Card sx={{ flex: 1, p: 3, background: gradients.glow, color: 'white' }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="white">
                  {getTierLabel(displayUser.tier)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Current Plan
                </MDTypography>
              </MDBox>
              <Crown size={32} color="white" />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  0
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Completed Assessments
                </MDTypography>
              </MDBox>
              <FileText size={32} color={colors.primary} />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  $0
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Estimated Value
                </MDTypography>
              </MDBox>
              <TrendingUp size={32} color={colors.accent} />
            </MDBox>
          </Card>
        </MDBox>

        {/* Action Cards and Past Assessments */}
        <MDBox display="flex" gap={3}>
          <Card sx={{ flex: 2, p: 4 }}>
            <MDTypography variant="h5" fontWeight="medium" color="text" mb={2}>
              Get Started with Your Valuation
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              Our comprehensive assessment analyzes your business across key value drivers to provide accurate valuation estimates and improvement recommendations.
            </MDTypography>
            <MDBox display="flex" gap={2}>
              <Link href="/assessment/free">
                <MDButton
                  sx={{
                    background: gradients.primary,
                    color: 'white',
                    py: 1.5,
                    px: 3
                  }}
                  startIcon={<FileText size={18} />}
                >
                  Start Free Assessment
                </MDButton>
              </Link>
              {displayUser.tier === 'free' ? (
                <Link href="/pricing">
                  <MDButton
                    sx={{
                      background: 'transparent',
                      border: `1px solid ${colors.primary}`,
                      color: colors.primary,
                      py: 1.5,
                      px: 3
                    }}
                    startIcon={<Crown size={18} />}
                  >
                    Upgrade to Growth
                  </MDButton>
                </Link>
              ) : (
                <Link href="/assessment/paid">
                  <MDButton
                    sx={{
                      background: 'transparent',
                      border: `1px solid ${colors.primary}`,
                      color: colors.primary,
                      py: 1.5,
                      px: 3
                    }}
                    startIcon={<Crown size={18} />}
                  >
                    Start Growth Assessment
                  </MDButton>
                </Link>
              )}
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 4, textAlign: 'center' }}>
            <Clock size={48} color={colors.accent} style={{ marginBottom: 16 }} />
            <MDTypography variant="h6" fontWeight="medium" color="text" mb={2}>
              Quick Assessment
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={3}>
              Complete in 10-15 minutes
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              Perfect for getting started
            </MDTypography>
          </Card>
        </MDBox>

        {/* Past Assessments Section */}
        <MDBox mt={4}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <MDBox display="flex" alignItems="center" gap={2}>
              <BarChart3 size={24} color={colors.primary} />
              <MDTypography variant="h5" fontWeight="medium" color="text">
                Recent Assessments
              </MDTypography>
            </MDBox>
            <Link href="/past-assessments">
              <MDButton
                sx={{
                  background: 'transparent',
                  color: colors.primary,
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                  '&:hover': {
                    background: 'rgba(0, 113, 141, 0.1)'
                  }
                }}
                startIcon={<Eye size={16} />}
              >
                View All
              </MDButton>
            </Link>
          </MDBox>
          <PastAssessmentsSection />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}