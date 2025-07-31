import { useState } from 'react';
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
  name: string;
  email: string;
  tier: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
}

// Mock user data - replace with actual auth data
const mockUser: DashboardUser = {
  name: 'Demo User',
  email: 'demo@applebites.ai',
  tier: 'free',
  firstName: 'Demo',
  lastName: 'User'
};

// Responsive Dashboard with Mobile/Desktop Views
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  // Force mobile for screens smaller than 768px - more aggressive detection
  const isMobile = useMediaQuery('(max-width:768px)') || 
                   (typeof window !== 'undefined' && window.innerWidth <= 768) ||
                   (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
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
    window.location.href = '/login';
    return null;
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

  // Desktop Layout
  return (
    <MDBox sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: 4
    }}>
      {/* Desktop Header */}
      <MDBox
        sx={{
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: 3,
          padding: 3,
          mb: 4,
          color: 'white'
        }}
      >
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: 56,
                height: 56,
                mr: 3
              }}
            >
              <User size={24} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium" sx={{ color: 'white' }}>
                Welcome back, {displayUser.name.split(' ')[0]}
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: '#81e5d8' }}>
                {displayUser.email}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox display="flex" alignItems="center" gap={2}>
            <MDBox
              sx={{
                background: getTierGradient(displayUser.tier),
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: 3,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {getTierLabel(displayUser.tier)} Plan
            </MDBox>
            
            <MDButton
              onClick={handleSignOut}
              sx={{
                background: 'transparent',
                border: `1px solid #EF4444`,
                color: '#EF4444',
                py: 1,
                px: 2
              }}
              startIcon={<LogOut size={18} />}
            >
              Sign Out
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Desktop Navigation */}
        <MDBox display="flex" gap={2}>
          <Link href="/assessment/free">
            <MDButton
              sx={{
                background: gradients.glow,
                color: 'white',
                py: 1.5,
                px: 3,
                fontSize: '1rem'
              }}
              startIcon={<Plus size={18} />}
            >
              New Assessment
            </MDButton>
          </Link>

          <Link href="/past-assessments">
            <MDButton
              sx={{
                background: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                color: '#dbdce1',
                py: 1.5,
                px: 3,
                fontSize: '1rem'
              }}
              startIcon={<Clock size={18} />}
            >
              Assessment History
            </MDButton>
          </Link>

          {displayUser.tier === 'free' && (
            <MDButton
              sx={{
                background: 'transparent',
                border: `1px solid ${colors.accent}`,
                color: colors.accent,
                py: 1.5,
                px: 3,
                fontSize: '1rem'
              }}
              startIcon={<Crown size={18} />}
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade Plan
            </MDButton>
          )}

          {displayUser.tier !== 'free' && (
            <Link href="/value-calculator">
              <MDButton
                sx={{
                  background: 'transparent',
                  border: `1px solid #4caf50`,
                  color: '#4caf50',
                  py: 1.5,
                  px: 3,
                  fontSize: '1rem'
                }}
                startIcon={<TrendingUp size={18} />}
              >
                Value Calculator
              </MDButton>
            </Link>
          )}
        </MDBox>
      </MDBox>

      {/* Main Desktop Content Grid */}
      <MDBox display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        {/* New Assessment Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            padding: 4,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 280,
            border: '1px solid #e3e6ea'
          }}
        >
          <MDBox display="flex" alignItems="center" mb={3}>
            <MDBox
              sx={{
                backgroundColor: '#e3f2fd',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3
              }}
            >
              <FileText size={32} color={colors.primary} />
            </MDBox>
            <MDBox>
              <MDTypography variant="h5" fontWeight="medium" mb={1}>
                New Assessment
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Start fresh valuation
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox flexGrow={1}>
            <MDTypography variant="body1" color="text" mb={4}>
              Create a comprehensive business valuation assessment to understand your company's current worth and growth potential.
            </MDTypography>
          </MDBox>
          
          <Link href="/assessment/free">
            <MDButton 
              sx={{
                background: gradients.primary,
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  background: gradients.glow,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              Get Started
            </MDButton>
          </Link>
        </MDBox>

        {/* Premium Features/Upgrade Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            padding: 4,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 280,
            border: '1px solid #e3e6ea'
          }}
        >
          <MDBox display="flex" alignItems="center" mb={3}>
            <MDBox
              sx={{
                backgroundColor: displayUser.tier === 'free' ? '#fff3e0' : '#e8f5e8',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3
              }}
            >
              {displayUser.tier === 'free' ? 
                <Crown size={32} color="#ff9800" /> : 
                <BarChart3 size={32} color="#4caf50" />
              }
            </MDBox>
            <MDBox>
              <MDTypography variant="h5" fontWeight="medium" mb={1}>
                {displayUser.tier === 'free' ? 'Upgrade Plan' : 'Premium Tools'}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {displayUser.tier === 'free' ? 'Unlock advanced features' : 'Access premium analytics'}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox flexGrow={1}>
            <MDTypography variant="body1" color="text" mb={4}>
              {displayUser.tier === 'free' ? 
                'Unlock premium features including detailed industry analysis, AI-powered insights, and comprehensive reports.' :
                'Access your premium features including value calculators, detailed analytics, and professional reporting tools.'
              }
            </MDTypography>
          </MDBox>
          
          {displayUser.tier === 'free' ? (
            <MDButton 
              sx={{
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                width: '100%'
              }}
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              endIcon={<ExternalLink size={18} />}
            >
              Upgrade Now
            </MDButton>
          ) : (
            <Link href="/value-calculator">
              <MDButton 
                sx={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                View Premium Tools
              </MDButton>
            </Link>
          )}
        </MDBox>

        {/* Quick Stats Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            padding: 4,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 280,
            border: '1px solid #e3e6ea'
          }}
        >
          <MDBox display="flex" alignItems="center" mb={3}>
            <MDBox
              sx={{
                backgroundColor: '#f3e5f5',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3
              }}
            >
              <BarChart3 size={32} color="#9c27b0" />
            </MDBox>
            <MDBox>
              <MDTypography variant="h5" fontWeight="medium" mb={1}>
                Your Stats
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Account overview
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox flexGrow={1}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <MDBox>
                <MDTypography variant="h3" color="primary" fontWeight="bold">0</MDTypography>
                <MDTypography variant="body2" color="text">Assessments Completed</MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography variant="h4" sx={{ color: colors.accent }} fontWeight="bold">
                  {getTierLabel(displayUser.tier)}
                </MDTypography>
                <MDTypography variant="body2" color="text">Current Plan</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}