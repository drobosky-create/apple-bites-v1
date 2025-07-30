import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDAvatar from '@/components/MD/MDAvatar';
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

// Simple Mobile-First Dashboard
export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
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

  // Apple Bites Brand Colors
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00718d 0%, #005b8c 100%)",
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

  return (
    <MDBox sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: { xs: 1, md: 4 }
    }}>
      {/* Mobile-First Header */}
      <MDBox
        sx={{
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: { xs: 2, md: 3 },
          padding: { xs: 2, md: 3 },
          mb: 3,
          color: 'white'
        }}
      >
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                mr: 2
              }}
            >
              <User size={20} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {displayUser.name}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#81e5d8', display: { xs: 'none', md: 'block' } }}>
                {displayUser.email}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox
            sx={{
              background: getTierGradient(displayUser.tier),
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: { xs: '0.65rem', md: '0.75rem' },
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {getTierLabel(displayUser.tier)}
          </MDBox>
        </MDBox>

        {/* Navigation Buttons */}
        <MDBox display="flex" gap={1} flexWrap="wrap">
          <Link href="/assessment/free">
            <MDButton
              sx={{
                background: gradients.glow,
                color: 'white',
                py: { xs: 1, md: 1.5 },
                px: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                flex: { xs: '1', md: 'none' },
                minWidth: { xs: '100px', md: 'auto' }
              }}
              startIcon={<Plus size={16} />}
            >
              New Assessment
            </MDButton>
          </Link>

          {displayUser.tier === 'free' && (
            <MDButton
              sx={{
                background: 'transparent',
                border: `1px solid ${colors.accent}`,
                color: colors.accent,
                py: { xs: 1, md: 1.5 },
                px: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                flex: { xs: '1', md: 'none' },
                minWidth: { xs: '100px', md: 'auto' }
              }}
              startIcon={<Crown size={16} />}
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade
            </MDButton>
          )}

          <Link href="/past-assessments">
            <MDButton
              sx={{
                background: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                color: '#dbdce1',
                py: { xs: 1, md: 1.5 },
                px: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                flex: { xs: '1', md: 'none' },
                minWidth: { xs: '80px', md: 'auto' },
                display: { xs: 'none', sm: 'flex' }
              }}
              startIcon={<Clock size={16} />}
            >
              History
            </MDButton>
          </Link>

          <MDButton
            onClick={handleSignOut}
            sx={{
              background: 'transparent',
              border: `1px solid #EF4444`,
              color: '#EF4444',
              py: { xs: 1, md: 1.5 },
              px: { xs: 1.5, md: 2 },
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              minWidth: { xs: '60px', md: 'auto' }
            }}
            startIcon={<LogOut size={16} />}
          >
            <MDBox sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign </MDBox>Out
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Main Content */}
      <MDBox display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
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
                backgroundColor: '#e3f2fd',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <FileText size={24} color={colors.primary} />
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

        {/* Upgrade/Premium Features Card */}
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
                backgroundColor: displayUser.tier === 'free' ? '#fff3e0' : '#e8f5e8',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              {displayUser.tier === 'free' ? 
                <Crown size={24} color="#ff9800" /> : 
                <BarChart3 size={24} color="#4caf50" />
              }
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              {displayUser.tier === 'free' ? 'Upgrade Plan' : 'Premium Features'}
            </MDTypography>
          </MDBox>
          <MDBox flexGrow={1}>
            <MDTypography variant="body2" color="text" mb={3}>
              {displayUser.tier === 'free' ? 
                'Unlock premium features including detailed industry analysis and AI-powered insights.' :
                'Access your premium features and detailed analytics.'
              }
            </MDTypography>
          </MDBox>
          {displayUser.tier === 'free' ? (
            <MDButton 
              variant="gradient" 
              color="warning" 
              fullWidth
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              endIcon={<ExternalLink size={16} />}
            >
              Upgrade Now
            </MDButton>
          ) : (
            <Link href="/value-calculator">
              <MDButton variant="outlined" color="success" fullWidth>
                View Premium Tools
              </MDButton>
            </Link>
          )}
        </MDBox>
      </MDBox>

      {/* Quick Stats for larger screens */}
      <MDBox sx={{ display: { xs: 'none', md: 'block' }, mt: 4 }}>
        <MDTypography variant="h5" fontWeight="medium" mb={3}>
          Quick Stats
        </MDTypography>
        <MDBox display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
          <MDBox sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <MDTypography variant="h4" color="primary" fontWeight="bold">0</MDTypography>
            <MDTypography variant="body2" color="text">Assessments Completed</MDTypography>
          </MDBox>
          <MDBox sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <MDTypography variant="h4" color="success" fontWeight="bold">{getTierLabel(displayUser.tier)}</MDTypography>
            <MDTypography variant="body2" color="text">Current Plan</MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}