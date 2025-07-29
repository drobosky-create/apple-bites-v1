import { Card, CardContent, Grid, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, Target, BarChart3, PieChart, Calculator, Star, Crown, Zap, Award, Building2 } from "lucide-react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import ValueDriversHeatmap from "@/components/value-drivers-heatmap";
import type { ValuationAssessment } from "@shared/schema";

interface StrategicReportProps {
  results: ValuationAssessment;
}

export default function StrategicReport({ results }: StrategicReportProps) {
  const formatCurrency = (value: string | null | number) => {
    if (!value) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const handleScheduleConsultation = () => {
    window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank');
  };

  return (
    <MDBox>
      {/* Strategic Report Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <MDBox display="flex" alignItems="center">
              <Crown size={32} color="#FFD700" style={{ marginRight: 16 }} />
              <MDBox>
                <MDTypography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                  Strategic Business Valuation Report
                </MDTypography>
                <MDTypography variant="h6" sx={{ color: '#ebfafb' }}>
                  Comprehensive Industry-Specific Analysis with AI Insights
                </MDTypography>
              </MDBox>
            </MDBox>
            <Chip 
              label="PREMIUM ANALYSIS" 
              sx={{ 
                background: '#FFD700', 
                color: '#0A1F44', 
                fontWeight: 'bold',
                px: 2,
                py: 1,
                fontSize: '0.9rem'
              }} 
            />
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="body1" sx={{ color: '#ebfafb' }}>
                  Strategic Valuation
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                  {formatCurrency(results.adjustedEbitda)}
                </MDTypography>
                <MDTypography variant="body1" sx={{ color: '#ebfafb' }}>
                  Adjusted EBITDA
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#FF9800' }}>
                  {results.overallScore || 'B'}
                </MDTypography>
                <MDTypography variant="body1" sx={{ color: '#ebfafb' }}>
                  Strategic Grade
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Award size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Executive Summary & Strategic Analysis
            </MDTypography>
          </MDBox>
          
          <MDTypography variant="body1" color="text" mb={3} sx={{ lineHeight: 1.8 }}>
            {results.executiveSummary || "Your comprehensive strategic analysis reveals strong operational foundations with significant value enhancement opportunities. Based on our proprietary NAICS-specific multiplier methodology and AI-powered insights, your business demonstrates competitive positioning within the industry landscape."}
          </MDTypography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox p={3} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2, border: '1px solid #E3F2FD' }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <TrendingUp size={20} color="#1976D2" style={{ marginRight: 8 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="primary">
                    Strategic Strengths
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  • Strong financial performance relative to industry benchmarks<br />
                  • Operational systems supporting scalable growth<br />
                  • Competitive differentiation in market position<br />
                  • Management team capabilities driving value creation
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE0B2' }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Target size={20} color="#F57C00" style={{ marginRight: 8 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="warning">
                    Value Enhancement Opportunities
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  • Recurring revenue optimization strategies<br />
                  • Customer concentration risk mitigation<br />
                  • Owner dependency reduction initiatives<br />
                  • Market expansion and growth acceleration
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Valuation Range Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Calculator size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Valuation Range Analysis
            </MDTypography>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={3} sx={{ backgroundColor: '#FFEBEE', borderRadius: 2 }}>
                <MDTypography variant="h5" fontWeight="bold" color="error">
                  {formatCurrency(results.lowEstimate)}
                </MDTypography>
                <MDTypography variant="body1" color="text" fontWeight="medium">
                  Conservative Scenario
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Risk-adjusted valuation with current operational constraints
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={3} sx={{ backgroundColor: '#E8F5E8', borderRadius: 2, border: '2px solid #4CAF50' }}>
                <MDTypography variant="h5" fontWeight="bold" color="success">
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="body1" color="text" fontWeight="medium">
                  Strategic Baseline
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Current market positioning with strategic improvements
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2 }}>
                <MDTypography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(results.highEstimate)}
                </MDTypography>
                <MDTypography variant="body1" color="text" fontWeight="medium">
                  Optimized Scenario
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Full strategic optimization with market expansion
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>

          <MDBox mt={3} p={3} sx={{ backgroundColor: '#F5F5F5', borderRadius: 2 }}>
            <MDTypography variant="body1" color="text" mb={2}>
              <strong>Strategic Multiplier Applied:</strong> {results.valuationMultiple || '4.2'}x EBITDA
            </MDTypography>
            <MDTypography variant="body2" color="textSecondary">
              This industry-specific multiplier reflects your business's strategic positioning, operational efficiency, 
              and growth potential within the current market environment. Our analysis incorporates NAICS-specific 
              benchmarks and strategic value driver assessments.
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>

      {/* Strategic Value Drivers Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <BarChart3 size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Value Drivers Assessment
            </MDTypography>
          </MDBox>
          
          <ValueDriversHeatmap assessment={results} />
          
          <MDBox mt={3} p={3} sx={{ backgroundColor: '#E8F5E8', borderRadius: 2 }}>
            <MDTypography variant="h6" fontWeight="bold" color="success" mb={2}>
              Strategic Insights & Recommendations
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Your strategic assessment reveals key opportunities for value enhancement through operational optimization, 
              market positioning improvements, and strategic growth initiatives. Focus areas include strengthening 
              recurring revenue streams, reducing owner dependency, and expanding market reach through scalable systems.
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>

      {/* Industry Positioning & Benchmarks */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Building2 size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Industry Positioning & Market Analysis
            </MDTypography>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox p={3} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
                  Market Position Score
                </MDTypography>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      flexGrow: 1, 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50'
                      }
                    }} 
                  />
                  <MDTypography variant="body1" fontWeight="bold" color="success" ml={2}>
                    75%
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="textSecondary">
                  Above industry average positioning with strong competitive advantages
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2 }}>
                <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
                  Growth Trajectory
                </MDTypography>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    sx={{ 
                      flexGrow: 1, 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FF9800'
                      }
                    }} 
                  />
                  <MDTypography variant="body1" fontWeight="bold" color="warning" ml={2}>
                    68%
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="textSecondary">
                  Strong growth potential with strategic optimization opportunities
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Strategic Action Plan */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Zap size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Action Plan & Next Steps
            </MDTypography>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, height: '100%' }}>
                <MDTypography variant="h6" fontWeight="bold" color="primary" mb={2}>
                  Phase 1: Foundation (0-3 months)
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  • Financial systems optimization<br />
                  • Management team development<br />
                  • Process documentation<br />
                  • Performance metrics implementation
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, height: '100%' }}>
                <MDTypography variant="h6" fontWeight="bold" color="warning" mb={2}>
                  Phase 2: Growth (3-9 months)
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  • Market expansion strategies<br />
                  • Recurring revenue initiatives<br />
                  • Customer concentration reduction<br />
                  • Technology infrastructure scaling
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox p={3} sx={{ backgroundColor: '#E8F5E8', borderRadius: 2, height: '100%' }}>
                <MDTypography variant="h6" fontWeight="bold" color="success" mb={2}>
                  Phase 3: Optimization (9-18 months)
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  • Strategic partnerships<br />
                  • Exit preparation strategies<br />
                  • Valuation maximization<br />
                  • Market positioning refinement
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Strategic Consultation Call-to-Action */}
      <Card sx={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Star size={32} color="#FFD700" style={{ marginBottom: 16 }} />
          
          <MDTypography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
            Ready to Execute Your Strategic Plan?
          </MDTypography>
          
          <MDTypography variant="h6" sx={{ color: '#ebfafb', mb: 3 }}>
            Schedule a comprehensive strategy session with our M&A experts to discuss your 
            strategic roadmap and value enhancement opportunities.
          </MDTypography>

          <MDButton 
            onClick={handleScheduleConsultation}
            variant="contained"
            size="large"
            sx={{ 
              background: '#FFD700', 
              color: '#0A1F44',
              fontWeight: 'bold',
              px: 4, 
              py: 1.5,
              '&:hover': {
                background: '#FFC107'
              }
            }}
          >
            Schedule Strategic Consultation
          </MDButton>
          
          <MDTypography variant="body2" sx={{ color: '#ebfafb', mt: 2 }}>
            Comprehensive strategic review • Value optimization planning • Exit preparation guidance
          </MDTypography>
        </CardContent>
      </Card>
    </MDBox>
  );
}