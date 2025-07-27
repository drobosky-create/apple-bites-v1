import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDAvatar from '@/components/MD/MDAvatar';
import MDBadge from '@/components/MD/MDBadge';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink
} from 'lucide-react';

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

function DashboardSidebar({ user }: { user: DashboardUser }) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'secondary';
      case 'growth': return 'primary';
      case 'capital': return 'success';
      default: return 'secondary';
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
        width: 280,
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #e0e6ed',
        padding: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* User Info Section */}
      <MDBox mb={4}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <MDAvatar
            sx={{
              backgroundColor: '#1976d2',
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <User size={24} color="white" />
          </MDAvatar>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              {user.name}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {user.email}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body2" mr={1}>
            Tier:
          </MDTypography>
          <MDBadge 
            variant="gradient" 
            color={getTierColor(user.tier)}
            size="sm"
          >
            {getTierLabel(user.tier)}
          </MDBadge>
        </MDBox>
      </MDBox>

      {/* Navigation Buttons */}
      <MDBox display="flex" flexDirection="column" gap={2}>
        <Link href="/assessment/free">
          <MDButton
            variant="gradient"
            color="primary"
            fullWidth
            startIcon={<Plus size={18} />}
          >
            New Assessment
          </MDButton>
        </Link>

        {user.tier === 'free' && (
          <MDButton
            variant="outlined"
            color="warning"
            fullWidth
            startIcon={<Crown size={18} />}
            onClick={() => window.open('https://products.applebites.ai/', '_blank')}
          >
            Upgrade Plan
          </MDButton>
        )}

        <MDButton
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<Clock size={18} />}
        >
          Past Assessments
        </MDButton>
      </MDBox>

      {/* Spacer */}
      <MDBox flexGrow={1} />

      {/* Footer */}
      <MDBox mt={4} pt={2} borderTop="1px solid #e0e6ed">
        <MDTypography variant="caption" color="text" textAlign="center">
          Powered by Apple Bites
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

function DashboardMainContent({ user }: { user: DashboardUser }) {
  const getDashboardTitle = (tier: string) => {
    switch (tier) {
      case 'free': return 'Your Free Assessment Dashboard';
      case 'growth': return 'Your Growth Plan Dashboard';
      case 'capital': return 'Your Capital Plan Dashboard';
      default: return 'Your Dashboard';
    }
  };

  return (
    <MDBox
      sx={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 4,
        overflow: 'auto'
      }}
    >
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" mb={1}>
          {getDashboardTitle(user.tier)}
        </MDTypography>
        <MDTypography variant="body1" color="text">
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
          <Link href="/assessment/free">
            <MDButton variant="gradient" color="primary">
              Start Assessment
            </MDButton>
          </Link>
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
              <FileText size={24} color="#1976d2" />
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              New Assessment
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text" mb={3}>
            Create a new business valuation assessment to get insights into your company's worth.
          </MDTypography>
          <Link href="/assessment/free">
            <MDButton variant="outlined" color="primary" fullWidth>
              Get Started
            </MDButton>
          </Link>
        </MDBox>

        {/* Upgrade/Report Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <MDBox display="flex" alignItems="center" mb={2}>
            <MDBox
              sx={{
                backgroundColor: user.tier === 'free' ? '#fff3e0' : '#e8f5e8',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              {user.tier === 'free' ? (
                <Crown size={24} color="#ff9800" />
              ) : (
                <BarChart3 size={24} color="#4caf50" />
              )}
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              {user.tier === 'free' ? 'Upgrade Plan' : 'View Reports'}
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text" mb={3}>
            {user.tier === 'free' 
              ? 'Unlock premium features including detailed industry analysis and AI-powered insights.'
              : 'Access your detailed valuation reports and premium analytics.'
            }
          </MDTypography>
          {user.tier === 'free' ? (
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
            <MDButton variant="outlined" color="success" fullWidth>
              View Reports
            </MDButton>
          )}
        </MDBox>
      </MDBox>

      {/* Past Assessments */}
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
          <MDButton variant="text" color="primary" size="small">
            View All
          </MDButton>
        </MDBox>
        
        <MDBox
          sx={{
            textAlign: 'center',
            py: 6,
            borderRadius: 1,
            backgroundColor: '#f8f9fa'
          }}
        >
          <Clock size={48} color="#9e9e9e" style={{ marginBottom: 16 }} />
          <MDTypography variant="h6" color="text" mb={1}>
            No assessments yet
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Your completed assessments will appear here. Start your first assessment to see your business valuation.
          </MDTypography>
          <Link href="/assessment/free">
            <MDButton variant="gradient" color="primary">
              Start First Assessment
            </MDButton>
          </Link>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default function DashboardClean() {
  // In real implementation, get user from auth context
  // const { user, isAuthenticated } = useAuth();
  const user = mockUser; // Replace with actual user data

  return (
    <MDBox display="flex" minHeight="100vh">
      <DashboardSidebar user={user} />
      <DashboardMainContent user={user} />
    </MDBox>
  );
}