import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
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
import DashboardLayout from '@/components/DashboardLayout';

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "#4CAF50"; // Green
      case "B": return "#8BC34A"; // Light Green  
      case "C": return "#FF9800"; // Orange
      case "D": return "#FF5722"; // Red Orange
      case "F": return "#F44336"; // Red
      default: return "#9E9E9E"; // Gray
    }
  };

  return (
    <MDBox>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h6" fontWeight="medium" color="dark">
          Recent Assessments
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
      ) : assessments && assessments.length > 0 ? (
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

                  <Link href={`/assessment-results/${assessment.id}`}>
                    <MDButton 
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<Eye size={14} />}
                    >
                      View
                    </MDButton>
                  </Link>
                </MDBox>
              </CardContent>
            </Card>
          ))}
        </MDBox>
      ) : (
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
      )}
    </MDBox>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const currentUser = (user as any) || mockUser;

  return (
    <DashboardLayout currentPage="dashboard">
      <MDBox
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          p: 4,
          minHeight: 'calc(100vh - 48px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        {/* Dashboard Header */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
            Welcome back, {currentUser?.firstName || 'User'}!
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Here's your business valuation dashboard overview.
          </MDTypography>
        </MDBox>

        {/* Quick Actions */}
        <MDBox 
          display="grid" 
          gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
          gap={3}
          mb={4}
        >
          <Link href="/assessment/free">
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'all 0.3s ease' }}>
              <CardContent>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Plus size={24} color="#00BFA6" />
                  <MDTypography variant="h6" fontWeight="medium" color="dark" ml={1}>
                    New Assessment
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Start a new business valuation assessment
                </MDTypography>
              </CardContent>
            </Card>
          </Link>

          <Link href="/value-calculator">
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'all 0.3s ease' }}>
              <CardContent>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <BarChart3 size={24} color="#0A1F44" />
                  <MDTypography variant="h6" fontWeight="medium" color="dark" ml={1}>
                    Value Calculator
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Explore improvement scenarios
                </MDTypography>
              </CardContent>
            </Card>
          </Link>

          <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'all 0.3s ease' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={2}>
                <ExternalLink size={24} color="#5EEAD4" />
                <MDTypography variant="h6" fontWeight="medium" color="dark" ml={1}>
                  Book Consultation
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="text">
                Schedule a call with our experts
              </MDTypography>
            </CardContent>
          </Card>
        </MDBox>

        {/* Past Assessments Section */}
        <PastAssessmentsSection />

        {/* Tier Information */}
        <MDBox mt={4} p={3} sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <Crown size={20} color="#FFD700" />
            <MDTypography variant="h6" fontWeight="medium" color="dark" ml={1}>
              Your Plan: {currentUser.tier?.toUpperCase() || 'FREE'}
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text" mb={2}>
            {currentUser.tier === 'free' 
              ? 'Upgrade to access advanced features and detailed analytics.'
              : 'You have access to premium features and detailed reporting.'
            }
          </MDTypography>
          {currentUser.tier === 'free' && (
            <MDButton variant="gradient" color="primary" size="small">
              Upgrade Plan
            </MDButton>
          )}
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}