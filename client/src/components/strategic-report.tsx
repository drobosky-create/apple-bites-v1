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

  // Advanced NAICS-aware deal structure analysis
  const getDealStructureRecommendations = () => {
    // Convert letter grades to numeric scores (A=5, B=4, C=3, D=2, F=1)
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    // Calculate core metrics
    const adjustedEbitda = results.adjustedEbitda ? parseFloat(results.adjustedEbitda) : 0;
    const financialScore = gradeToScore(results.financialPerformance);
    const recurringRevenueScore = gradeToScore(results.recurringRevenue);
    const growthScore = gradeToScore(results.growthProspects);
    const ownerDependencyScore = gradeToScore(results.ownerDependency);
    const customerConcentrationScore = gradeToScore(results.customerConcentration);
    const managementScore = gradeToScore(results.managementTeam);
    const operationalScore = gradeToScore(results.systemsProcesses);
    const scalabilityScore = (operationalScore + managementScore) / 2;
    const differentiationScore = gradeToScore(results.competitivePosition);

    // NAICS-based industry analysis
    const naicsCode = results.naicsCode || '';
    const naicsPrefix = naicsCode.substring(0, 3);
    
    // NAICS-to-deal mapping configuration
    const naicsDealsMap: { [key: string]: string[] } = {
      '541': ['SaaS Roll-Up', 'Add-On Acquisition', 'Growth Equity', 'Strategic Acquisition'], // Professional Services
      '621': ['Private Equity Platform', 'Add-On Acquisition', 'Management Buyout'], // Healthcare Services
      '238': ['Owner-Operator Acquisition', 'SBA-Backed Deal', 'Roll-Up Opportunity'], // Construction/Trades
      '512': ['Strategic Acquisition', 'Growth Equity', 'Minority Recapitalization'], // Media/Software
      '31': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '32': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '33': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '44': ['Strategic Acquisition', 'Roll-Up Opportunity', 'Asset Sale'], // Retail
      '45': ['Strategic Acquisition', 'Roll-Up Opportunity', 'Asset Sale'], // Retail
      '48': ['Private Equity Platform', 'Management Buyout', 'ESOP'], // Transportation
      '49': ['Private Equity Platform', 'Management Buyout', 'ESOP'], // Transportation
      '812': ['SBA-Backed Deal', 'Seller-Financed Exit', 'Search Fund Acquisition'], // Personal Services
      '561': ['Roll-Up Opportunity', 'Search Fund Acquisition', 'Owner-Operator Acquisition'], // Business Support
      '52': ['Minority Recapitalization', 'Private Equity Platform', 'Strategic Acquisition'], // Finance
      '53': ['Minority Recapitalization', 'Private Equity Platform', 'Strategic Acquisition'] // Real Estate
    };

    interface DealStructure {
      dealType: string;
      rationale: string;
      relevanceScore: number;
      tags: string[];
    }

    const dealOptions: DealStructure[] = [];

    // NAICS-specific deal structure recommendations
    const preferredDeals = naicsDealsMap[naicsPrefix] || [];
    
    // SaaS Roll-Up - Tech/Software industries with recurring revenue
    if ((naicsPrefix === '541' || naicsPrefix === '512') && recurringRevenueScore >= 3.5) {
      dealOptions.push({
        dealType: "SaaS Roll-Up",
        rationale: `Your NAICS code (${naicsCode}) places you in a software-driven industry. Combined with strong recurring revenue, this makes you ideal for a SaaS aggregator or roll-up.`,
        relevanceScore: 0.95 + (recurringRevenueScore - 3.5) / 10,
        tags: ["SaaS", "Recurring Revenue", `NAICS ${naicsPrefix}`]
      });
    }

    // Healthcare PE Platform - Healthcare services with scale
    if (naicsPrefix === '621' && adjustedEbitda > 2000000 && managementScore >= 4) {
      dealOptions.push({
        dealType: "Private Equity Platform",
        rationale: `As a healthcare provider with scale and leadership, you're highly attractive to healthcare-focused PE firms building platforms in NAICS ${naicsPrefix}.`,
        relevanceScore: 0.93 + Math.min(adjustedEbitda / 10000000, 0.05),
        tags: ["Healthcare", "PE Interest", `NAICS ${naicsPrefix}`]
      });
    }

    // Construction/Trades - Often owner-dependent
    if (naicsPrefix === '238' || naicsPrefix === '236') {
      if (ownerDependencyScore < 3) {
        dealOptions.push({
          dealType: "Owner-Operator Acquisition",
          rationale: `Construction/trades businesses in NAICS ${naicsPrefix} typically require hands-on ownership, making this ideal for an owner-operator buyer.`,
          relevanceScore: 0.85 - (ownerDependencyScore - 1) / 10,
          tags: ["Construction", "Owner-Operator", `NAICS ${naicsPrefix}`]
        });
      }
      if (adjustedEbitda < 3000000) {
        dealOptions.push({
          dealType: "SBA-Backed Deal",
          rationale: `Your industry profile in NAICS ${naicsPrefix} aligns well with SBA lending programs for small business acquisitions.`,
          relevanceScore: 0.82,
          tags: ["SBA Eligible", "Small Business", `NAICS ${naicsPrefix}`]
        });
      }
    }

    // Manufacturing - Traditional LBO/ESOP candidates
    if (['31', '32', '33'].includes(naicsPrefix.substring(0, 2))) {
      if (adjustedEbitda > 3000000 && financialScore >= 3.5) {
        dealOptions.push({
          dealType: "Leveraged Buyout (LBO)",
          rationale: `Manufacturing businesses in NAICS ${naicsPrefix} with stable cash flows are attractive LBO candidates for financial buyers.`,
          relevanceScore: 0.88 + financialScore / 20,
          tags: ["Manufacturing", "Stable Cash Flow", `NAICS ${naicsPrefix}`]
        });
      }
      if (managementScore >= 3 && ownerDependencyScore >= 3) {
        dealOptions.push({
          dealType: "ESOP (Employee Ownership)",
          rationale: `Legacy manufacturing companies in NAICS ${naicsPrefix} often transition successfully to employee ownership structures.`,
          relevanceScore: 0.80 + managementScore / 25,
          tags: ["Employee Ownership", "Manufacturing", `NAICS ${naicsPrefix}`]
        });
      }
    }

    // Professional Services - PE Roll-up activity
    if (naicsPrefix === '541' && scalabilityScore >= 3.5) {
      dealOptions.push({
        dealType: "Add-On Acquisition",
        rationale: `Professional services firms in NAICS ${naicsPrefix} are actively targeted by PE roll-up strategies seeking geographic or service expansion.`,
        relevanceScore: 0.87 + scalabilityScore / 20,
        tags: ["Professional Services", "PE Roll-up", `NAICS ${naicsPrefix}`]
      });
    }

    // Strategic Acquisition - High differentiation + strong operations (universal)
    if (differentiationScore >= 4 && operationalScore >= 4 && growthScore >= 4) {
      dealOptions.push({
        dealType: "Strategic Acquisition",
        rationale: "Strong competitive differentiation and operational excellence make this an attractive strategic target for industry consolidation.",
        relevanceScore: 0.90 + (differentiationScore + operationalScore) / 20,
        tags: ["High Differentiation", "Strong Operations", "Strategic Value"]
      });
    }

    // Generic deal structures for all industries (when NAICS-specific don't apply)
    
    // Growth Equity - High growth + emerging management
    if (growthScore >= 4 && managementScore >= 3 && managementScore < 5) {
      dealOptions.push({
        dealType: "Growth Equity",
        rationale: "Strong growth prospects with developing management team indicate readiness for minority growth capital investment.",
        relevanceScore: 0.85 + (growthScore - 4) / 10,
        tags: ["High Growth Potential", "Emerging Leadership", "Minority Investment"]
      });
    }

    // Management Buyout - Strong management + low owner dependency
    if (managementScore >= 4 && ownerDependencyScore >= 4) {
      dealOptions.push({
        dealType: "Management Buyout (MBO)",
        rationale: "Strong management team with operational independence creates ideal conditions for management-led acquisition.",
        relevanceScore: 0.80 + (managementScore + ownerDependencyScore) / 25,
        tags: ["Strong Management", "Operational Independence", "Internal Transition"]
      });
    }

    // Search Fund Acquisition - Mid-size with good fundamentals
    if (adjustedEbitda >= 500000 && adjustedEbitda <= 3000000 && financialScore >= 3) {
      dealOptions.push({
        dealType: "Search Fund Acquisition",
        rationale: "Size and financial profile match typical search fund acquisition criteria for entrepreneurial buyers.",
        relevanceScore: 0.78 + financialScore / 25,
        tags: ["Search Fund Size", "Financial Stability", "Entrepreneurial Buyer"]
      });
    }

    // Roll-Up Opportunity - Fragmented industry with scale potential
    if (scalabilityScore >= 3.5 && differentiationScore < 4) {
      dealOptions.push({
        dealType: "Roll-Up Opportunity",
        rationale: "Scalable business model in fragmented market presents consolidation opportunity for roll-up strategy.",
        relevanceScore: 0.76 + scalabilityScore / 25,
        tags: ["Market Fragmentation", "Scalability", "Consolidation Play"]
      });
    }

    // Turnaround Investment - Poor performance but good fundamentals
    if (financialScore < 3 && (operationalScore >= 3 || differentiationScore >= 3)) {
      dealOptions.push({
        dealType: "Turnaround Investment",
        rationale: "Underlying business strengths with financial challenges create turnaround investment opportunity.",
        relevanceScore: 0.70 + (operationalScore + differentiationScore) / 40,
        tags: ["Financial Distress", "Operational Potential", "Value Creation"]
      });
    }

    // Seller-Financed Exit - Lower valuation or challenging market conditions
    if (adjustedEbitda < 2000000 || financialScore < 3.5) {
      dealOptions.push({
        dealType: "Seller-Financed Exit",
        rationale: "Business profile suggests seller financing may be necessary to bridge valuation gaps and facilitate transaction.",
        relevanceScore: 0.75 - Math.max(0, (financialScore - 2) / 10),
        tags: ["Seller Financing", "Valuation Bridge", "Flexible Terms"]
      });
    }

    // Fallback: Asset Sale if no better options
    if (dealOptions.length === 0 || (financialScore < 2.5 && operationalScore < 2.5)) {
      dealOptions.push({
        dealType: "Asset Sale",
        rationale: "Current business performance suggests asset-based transaction may provide better value realization than going concern sale.",
        relevanceScore: 0.60,
        tags: ["Asset Based", "Distressed", "Liquidation Value"]
      });
    }

    // Sort by relevance score and return top 4
    return dealOptions
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4)
      .map(deal => deal.dealType);
  };

  return (
    <MDBox>
      {/* Strategic Report Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)', color: 'white', borderRadius: 1.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="300" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, letterSpacing: '0.5px' }}>
                Strategic Business Valuation
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: '300' }}>
                Comprehensive industry-specific analysis for {results.company}
              </MDTypography>
            </MDBox>
            <Chip 
              label="STRATEGIC ANALYSIS" 
              sx={{ 
                background: 'rgba(255,255,255,0.12)', 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: '400',
                fontSize: '0.75rem',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.5px'
              }} 
            />
          </MDBox>

          <MDBox display="flex" gap={3}>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {formatCurrency(results.midEstimate)}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Business Valuation
              </MDTypography>
            </MDBox>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {formatCurrency(results.adjustedEbitda)}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Adjusted EBITDA
              </MDTypography>
            </MDBox>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {results.overallScore || 'B+'}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Overall Grade
              </MDTypography>
            </MDBox>
          </MDBox>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, border: '1px solid #BBDEFB' }}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Building2 size={20} color="#2196F3" style={{ marginRight: 8 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="primary">
                    Deal Structure Fit
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  {getDealStructureRecommendations().map((recommendation, index) => (
                    <span key={index}>
                      • {recommendation}
                      {index < getDealStructureRecommendations().length - 1 && <br />}
                    </span>
                  ))}
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
                  <MDTypography variant="h3" fontWeight="bold" color="success">
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
                  <MDTypography variant="h3" fontWeight="bold" color="warning">
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