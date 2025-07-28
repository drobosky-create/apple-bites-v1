import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Calendar, Eye } from "lucide-react";
import { useLocation, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

// Assessment interface for Past Assessments
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

export default function PastAssessments() {
  const [, setLocation] = useLocation();

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'growth': return 'primary';
      case 'capital': return 'error';
      default: return 'default';
    }
  };

  const viewAssessment = (assessment: Assessment) => {
    setLocation(`/assessment-results/${assessment.id}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout currentPage="past-assessments">
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MDTypography variant="h6" color="text">
            Loading your assessments...
          </MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="past-assessments">
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
        {/* Header */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
            Past Business Valuations
          </MDTypography>
          <MDTypography variant="h6" color="text">
            Review your completed business valuation assessments and track your progress over time.
          </MDTypography>
        </MDBox>

        {/* Assessments Grid */}
        {assessments && assessments.length > 0 ? (
          <MDBox display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
            {assessments.map((assessment) => (
              <Card key={assessment.id} sx={{ height: 'fit-content', cursor: 'pointer' }} onClick={() => viewAssessment(assessment)}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header with Company and Date */}
                  <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        {assessment.company || 'Your Business'}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Calendar size={14} color="#666" />
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(assessment.createdAt || '')}
                        </Typography>
                      </MDBox>
                    </MDBox>
                    
                    <Chip 
                      label={assessment.tier?.toUpperCase() || 'FREE'} 
                      size="small" 
                      color={getTierColor(assessment.tier || 'free') as any}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </MDBox>

                  {/* Valuation Summary */}
                  <MDBox 
                    sx={{ 
                      background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', 
                      borderRadius: '12px',
                      p: 2,
                      mb: 2,
                      color: 'white'
                    }}
                  >
                    <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Estimated Value
                    </MDTypography>
                    <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#5EEAD4' }}>
                      {formatCurrency(assessment.midEstimate)}
                    </MDTypography>
                    <MDBox display="flex" justifyContent="space-between" mt={1}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {formatCurrency(assessment.lowEstimate)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {formatCurrency(assessment.highEstimate)}
                      </Typography>
                    </MDBox>
                  </MDBox>

                  {/* Key Metrics */}
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDBox>
                      <Typography variant="body2" color="textSecondary">EBITDA</Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(assessment.adjustedEbitda)}
                      </Typography>
                    </MDBox>
                    
                    <MDBox textAlign="center">
                      <Typography variant="body2" color="textSecondary">Multiple</Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {assessment.valuationMultiple}x
                      </Typography>
                    </MDBox>
                    
                    <MDBox textAlign="center">
                      <Typography variant="body2" color="textSecondary">Grade</Typography>
                      <MDBox
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: getGradeColor(assessment.overallScore || 'C'),
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          margin: '0 auto'
                        }}
                      >
                        {assessment.overallScore}
                      </MDBox>
                    </MDBox>
                  </MDBox>

                  {/* View Button */}
                  <MDButton 
                    variant="gradient"
                    color="info"
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      viewAssessment(assessment);
                    }}
                    sx={{ width: '100%', mt: 1 }}
                  >
                    View Full Report
                  </MDButton>
                </CardContent>
              </Card>
            ))}
          </MDBox>
        ) : (
          <MDBox
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 2,
              backgroundColor: 'rgba(248, 249, 250, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '2px dashed rgba(203, 213, 225, 0.6)'
            }}
          >
            <Calendar size={64} color="#9ca3af" style={{ marginBottom: 24 }} />
            <MDTypography variant="h5" color="text" mb={2}>
              No assessments yet
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={4}>
              Your completed business valuations will appear here. Start your first assessment to get started.
            </MDTypography>
            <Link href="/assessment/free">
              <MDButton variant="gradient" color="primary" size="large">
                Start Your First Assessment
              </MDButton>
            </Link>
          </MDBox>
        )}
      </MDBox>
    </DashboardLayout>
  );
}