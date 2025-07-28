import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Calendar, TrendingUp, FileText, Eye } from "lucide-react";
import { useLocation } from "wouter";
import type { ValuationAssessment } from "@shared/schema";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

export default function PastAssessments() {
  const [, setLocation] = useLocation();

  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
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
      case "A": return "#4CAF50";
      case "B": return "#8BC34A";
      case "C": return "#FF9800";
      case "D": return "#FF5722";
      case "F": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "default";
      case "growth": return "primary";
      case "capital": return "success";
      default: return "default";
    }
  };

  const viewAssessment = (assessment: ValuationAssessment) => {
    setLocation(`/value-calculator?assessmentId=${assessment.id}`);
  };

  if (isLoading) {
    return (
      <MDBox sx={{ maxWidth: '1200px', margin: '0 auto', p: 3 }}>
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={4}>
          Loading Past Assessments...
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox sx={{ maxWidth: '1200px', margin: '0 auto', p: 3 }}>
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

                {/* Action Button */}
                <MDButton 
                  variant="outlined"
                  color="info"
                  fullWidth
                  startIcon={<Eye size={16} />}
                  onClick={() => viewAssessment(assessment)}
                >
                  View Full Report
                </MDButton>
              </CardContent>
            </Card>
          ))}
        </MDBox>
      ) : (
        <Card sx={{ textAlign: 'center', p: 6 }}>
          <CardContent>
            <FileText size={64} color="#9E9E9E" style={{ margin: '0 auto 16px' }} />
            <MDTypography variant="h6" color="text" mb={2}>
              No Past Assessments Found
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              You haven't completed any business valuation assessments yet. Start your first assessment to track your business value over time.
            </MDTypography>
            <MDButton 
              variant="gradient"
              color="primary"
              startIcon={<TrendingUp size={16} />}
              onClick={() => setLocation('/assessment/free')}
            >
              Start New Assessment
            </MDButton>
          </CardContent>
        </Card>
      )}
    </MDBox>
  );
}