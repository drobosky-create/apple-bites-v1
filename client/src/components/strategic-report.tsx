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

  // Enhanced AI-powered Executive Summary Generation
  const generateIntelligentSummary = () => {
    const naicsCode = results.naicsCode || '';
    const company = results.company || 'your business';
    const valuation = results.midEstimate ? parseFloat(results.midEstimate) : 0;
    const ebitda = results.adjustedEbitda ? parseFloat(results.adjustedEbitda) : 0;
    const revenue = results.revenue ? parseFloat(results.revenue) : 0;
    const overallGrade = results.overallScore || 'B';
    
    // Advanced industry context mapping
    const industryInsights: { [key: string]: { name: string; context: string; trends: string } } = {
      '541': { 
        name: 'professional services sector', 
        context: 'characterized by knowledge-based service delivery and relationship-driven revenue models',
        trends: 'experiencing digital transformation pressures and increasing demand for specialized expertise'
      },
      '621': { 
        name: 'healthcare services industry', 
        context: 'operating in a regulated environment with demographic tailwinds and consolidation activity',
        trends: 'benefiting from aging population dynamics and value-based care transitions'
      },
      '238': { 
        name: 'construction and trades market', 
        context: 'featuring project-based revenue cycles and skilled labor dependencies',
        trends: 'facing workforce challenges while benefiting from infrastructure investment trends'
      },
      '512': { 
        name: 'technology and software industry', 
        context: 'driven by recurring revenue models and scalable digital architectures',
        trends: 'experiencing rapid growth in SaaS adoption and AI-powered solutions'
      },
      '331': { 
        name: 'manufacturing sector', 
        context: 'characterized by capital-intensive operations and supply chain complexities',
        trends: 'undergoing automation transformation and nearshoring initiatives'
      },
      '31': { name: 'manufacturing sector', context: 'capital-intensive with supply chain focus', trends: 'automation and efficiency gains' },
      '32': { name: 'manufacturing sector', context: 'industrial production environment', trends: 'technology integration trends' },
      '33': { name: 'manufacturing sector', context: 'heavy industrial operations', trends: 'sustainability and efficiency focus' }
    };
    
    const industryData = industryInsights[naicsCode.substring(0, 3)] || industryInsights[naicsCode.substring(0, 2)] || 
      { name: 'your industry', context: 'with unique operational characteristics', trends: 'adapting to market evolution' };
    
    const multiple = ebitda > 0 ? (valuation / ebitda).toFixed(1) : '0';
    const marginProfile = ebitda > 0 && revenue > 0 ? ((ebitda / revenue) * 100).toFixed(1) : '0';
    
    // Comprehensive AI-generated summary
    let summary = `${company} operates within the ${industryData.name}, ${industryData.context}. `;
    
    // Performance assessment with context
    if (overallGrade >= 'A') {
      summary += `Our comprehensive analysis reveals exceptional operational performance across all value drivers, positioning the business as a premium asset within its market segment. `;
    } else if (overallGrade >= 'B') {
      summary += `The strategic assessment demonstrates strong operational fundamentals with competitive market positioning, indicating a well-managed enterprise with clear value creation opportunities. `;
    } else {
      summary += `While the business maintains solid operational foundations, our analysis identifies significant value enhancement potential through targeted operational improvements and strategic initiatives. `;
    }
    
    // Financial performance deep dive
    if (revenue > 0) {
      if (revenue > 50000000) {
        summary += `With annual revenues of ${formatCurrency(revenue)}, the company operates at substantial scale within its sector. `;
      } else if (revenue > 10000000) {
        summary += `Annual revenues of ${formatCurrency(revenue)} position the business in the established mid-market segment. `;
      } else {
        summary += `Current revenue base of ${formatCurrency(revenue)} indicates growth-stage operations with expansion potential. `;
      }
    }
    
    // EBITDA and profitability analysis
    if (ebitda > 5000000) {
      summary += `The business generates robust adjusted EBITDA of ${formatCurrency(ebitda)}, demonstrating institutional-quality cash flow generation `;
    } else if (ebitda > 1000000) {
      summary += `Adjusted EBITDA of ${formatCurrency(ebitda)} reflects solid operational efficiency `;
    } else {
      summary += `Current EBITDA performance of ${formatCurrency(ebitda)} suggests opportunities for margin optimization `;
    }
    
    // Margin analysis
    if (parseFloat(marginProfile) > 20) {
      summary += `with exceptional ${marginProfile}% EBITDA margins significantly above industry benchmarks. `;
    } else if (parseFloat(marginProfile) > 10) {
      summary += `achieving healthy ${marginProfile}% EBITDA margins consistent with industry standards. `;
    } else if (parseFloat(marginProfile) > 0) {
      summary += `operating at ${marginProfile}% EBITDA margins with potential for improvement through operational optimization. `;
    }
    
    // Valuation multiple context with market positioning
    if (parseFloat(multiple) > 7) {
      summary += `The resulting ${multiple}x EBITDA valuation multiple reflects premium market positioning, indicating strong buyer interest and competitive advantages that justify above-market pricing. `;
    } else if (parseFloat(multiple) > 5) {
      summary += `At ${multiple}x EBITDA, the valuation multiple aligns with industry standards for well-positioned businesses, suggesting balanced risk-return characteristics attractive to strategic and financial buyers. `;
    } else if (parseFloat(multiple) > 3) {
      summary += `The ${multiple}x EBITDA multiple indicates moderate market positioning with opportunities to enhance valuation through strategic improvements and operational excellence initiatives. `;
    } else {
      summary += `Current valuation multiple of ${multiple}x EBITDA suggests significant upside potential through comprehensive value enhancement strategies. `;
    }
    
    // Industry trends and market context
    summary += `Within the broader market context, the ${industryData.name} is currently ${industryData.trends}, creating both opportunities and challenges for market participants.`;
    
    return summary;
  };

  // Dynamic Strategic Strengths based on assessment
  const generateStrategicStrengths = () => {
    const strengths = [];
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    if (gradeToScore(results.financialPerformance) >= 4) {
      strengths.push('Strong financial performance relative to industry benchmarks');
    }
    if (gradeToScore(results.recurringRevenue) >= 4) {
      strengths.push('Robust recurring revenue base providing predictable cash flows');
    }
    if (gradeToScore(results.managementTeam) >= 4) {
      strengths.push('Experienced management team with proven operational capabilities');
    }
    if (gradeToScore(results.competitivePosition) >= 4) {
      strengths.push('Strong competitive differentiation in market position');
    }
    if (gradeToScore(results.systemsProcesses) >= 4) {
      strengths.push('Well-developed operational systems supporting scalable growth');
    }
    if (gradeToScore(results.customerConcentration) >= 4) {
      strengths.push('Diversified customer base reducing concentration risk');
    }

    // Fallback strengths if none qualify
    if (strengths.length === 0) {
      strengths.push(
        'Established market presence with operational foundation',
        'Industry knowledge and customer relationships',
        'Potential for operational improvements and growth'
      );
    }

    return strengths.slice(0, 4); // Return top 4 strengths
  };

  // Dynamic Value Enhancement Opportunities
  const generateValueOpportunities = () => {
    const opportunities = [];
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    if (gradeToScore(results.recurringRevenue) < 4) {
      opportunities.push('Recurring revenue optimization and contract enhancement');
    }
    if (gradeToScore(results.customerConcentration) < 4) {
      opportunities.push('Customer diversification and concentration risk mitigation');
    }
    if (gradeToScore(results.ownerDependency) < 4) {
      opportunities.push('Owner dependency reduction and management development');
    }
    if (gradeToScore(results.systemsProcesses) < 4) {
      opportunities.push('Operational systems enhancement and process automation');
    }
    if (gradeToScore(results.growthProspects) < 4) {
      opportunities.push('Market expansion and growth acceleration initiatives');
    }
    if (gradeToScore(results.managementTeam) < 4) {
      opportunities.push('Leadership team strengthening and succession planning');
    }

    // Ensure minimum 4 opportunities by adding common improvement areas
    if (opportunities.length < 4) {
      const additionalOpportunities = [
        'Digital transformation and technology adoption',
        'Strategic acquisitions and market consolidation', 
        'Premium service offerings and margin expansion',
        'Geographic expansion and new market penetration',
        'Operational efficiency and cost optimization',
        'Strategic partnerships and alliance development'
      ];
      
      for (const additional of additionalOpportunities) {
        if (opportunities.length >= 4) break;
        if (!opportunities.includes(additional)) {
          opportunities.push(additional);
        }
      }
    }

    return opportunities.slice(0, 4); // Return exactly 4 opportunities
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
            {results.executiveSummary || generateIntelligentSummary()}
          </MDTypography>

          <Box display="flex" gap={3} sx={{ '& > *': { flex: 1 } }}>
            <MDBox p={3} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2, border: '1px solid #E3F2FD', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#1976D2" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  Strategic Strengths
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {generateStrategicStrengths().map((strength, index) => (
                  <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '8px', display: 'block' }}>
                    • {strength}
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE0B2', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Target size={20} color="#F57C00" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="warning">
                  Value Enhancement Opportunities
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {generateValueOpportunities().map((opportunity, index) => (
                  <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '8px', display: 'block' }}>
                    • {opportunity}
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, border: '1px solid #BBDEFB', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Building2 size={20} color="#2196F3" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  Deal Structure Fit
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {(() => {
                  const recommendations = getDealStructureRecommendations().slice(0, 4);
                  if (recommendations.length === 0) return null;
                  
                  return (
                    <>
                      {/* Primary Recommendation */}
                      <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#0b2147', marginBottom: '12px', textAlign: 'center' }}>
                        {recommendations[0]}
                      </MDTypography>
                      
                      {/* Additional Options */}
                      {recommendations.length > 1 && (
                        <MDBox sx={{ textAlign: 'center' }}>
                          <MDTypography variant="subtitle2" fontWeight="medium" sx={{ color: '#666', marginBottom: '8px', marginTop: '16px' }}>
                            Additional Options
                          </MDTypography>
                          {recommendations.slice(1).map((dealType, index) => (
                            <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '10px', display: 'block' }}>
                              • {dealType}
                            </MDTypography>
                          ))}
                        </MDBox>
                      )}
                    </>
                  );
                })()}
              </MDBox>
            </MDBox>
          </Box>
        </CardContent>
      </Card>

      {/* Valuation Range Analysis - Interactive Scale */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={4}>
            <Calculator size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Valuation Range Analysis
            </MDTypography>
          </MDBox>

          {/* Interactive Valuation Scale */}
          <MDBox sx={{ position: 'relative', mb: 4 }}>
            {/* Scale Background */}
            <MDBox 
              sx={{ 
                height: '80px',
                background: 'linear-gradient(90deg, #ef5350 0%, #ff9800 35%, #4caf50 50%, #2196f3 65%, #1976d2 100%)',
                borderRadius: '40px',
                position: 'relative',
                mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {/* Scale Labels */}
              <MDBox sx={{ position: 'absolute', top: '-30px', left: '0%', transform: 'translateX(-50%)' }}>
                <MDTypography variant="caption" fontWeight="bold" color="error">CONSERVATIVE</MDTypography>
              </MDBox>
              <MDBox sx={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>
                <MDTypography variant="caption" fontWeight="bold" color="success">STRATEGIC</MDTypography>
              </MDBox>
              <MDBox sx={{ position: 'absolute', top: '-30px', left: '100%', transform: 'translateX(-50%)' }}>
                <MDTypography variant="caption" fontWeight="bold" color="primary">OPTIMIZED</MDTypography>
              </MDBox>

              {/* Value Markers */}
              {/* Low Estimate Marker */}
              <MDBox 
                sx={{ 
                  position: 'absolute',
                  left: '15%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  border: '3px solid #ef5350',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              />
              
              {/* Mid Estimate Marker (Highlighted) */}
              <MDBox 
                sx={{ 
                  position: 'absolute',
                  left: '55%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#4caf50',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                  zIndex: 2
                }}
              />
              
              {/* High Estimate Marker */}
              <MDBox 
                sx={{ 
                  position: 'absolute',
                  left: '85%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  border: '3px solid #2196f3',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              />
            </MDBox>

            {/* Value Labels Below Scale */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center" px={2}>
              <MDBox textAlign="center" sx={{ flex: '0 0 30%' }}>
                <MDTypography variant="h5" fontWeight="bold" color="error" mb={1}>
                  {formatCurrency(results.lowEstimate)}
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Risk-adjusted baseline
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center" sx={{ flex: '0 0 40%' }}>
                <MDTypography variant="h4" fontWeight="bold" color="success" mb={1}>
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="body1" fontWeight="medium" color="success">
                  Strategic Baseline Value
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Current positioning + improvements
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center" sx={{ flex: '0 0 30%' }}>
                <MDTypography variant="h5" fontWeight="bold" color="primary" mb={1}>
                  {formatCurrency(results.highEstimate)}
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Full optimization potential
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Multiplier Information */}
          <MDBox mt={4} p={3} sx={{ backgroundColor: '#F5F5F5', borderRadius: 2, textAlign: 'center' }}>
            <MDBox display="flex" alignItems="center" justifyContent="center" mb={2}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mr={1}>
                Strategic Multiplier:
              </MDTypography>
              <MDTypography variant="h5" fontWeight="bold" color="primary">
                {results.valuationMultiple || '4.2'}x EBITDA
              </MDTypography>
            </MDBox>
            <MDTypography variant="body2" color="textSecondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              This industry-specific multiplier reflects your business's strategic positioning, operational efficiency, 
              and growth potential within the current market environment based on NAICS-specific benchmarks.
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>

      {/* Strategic Value Drivers Analysis - Circular Dashboard Layout */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={4}>
            <BarChart3 size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Value Drivers Assessment
            </MDTypography>
          </MDBox>
          
          {/* Circular Value Drivers Layout */}
          <MDBox sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 4 }}>
            {/* Central Score Circle */}
            <MDBox
              sx={{
                position: 'relative',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                zIndex: 2
              }}
            >
              <MDTypography variant="h3" fontWeight="bold" color="white" mb={1}>
                {results.overallGrade || 'B+'}
              </MDTypography>
              <MDTypography variant="h6" color="white" textAlign="center">
                Overall Grade
              </MDTypography>
              <MDTypography variant="body2" color="white" sx={{ opacity: 0.8 }} textAlign="center">
                Strategic Position
              </MDTypography>
            </MDBox>

            {/* Orbiting Value Driver Cards */}
            {(() => {
              const drivers = [
                { name: 'Financial Performance', grade: results.financialPerformance || 'B', color: '#2196f3', angle: 0 },
                { name: 'Recurring Revenue', grade: results.recurringRevenue || 'A', color: '#4caf50', angle: 45 },
                { name: 'Growth Prospects', grade: results.growthProspects || 'B', color: '#ff9800', angle: 90 },
                { name: 'Management Team', grade: results.managementTeam || 'A', color: '#9c27b0', angle: 135 },
                { name: 'Competitive Position', grade: results.competitivePosition || 'B', color: '#f44336', angle: 180 },
                { name: 'Customer Base', grade: results.customerConcentration || 'C', color: '#607d8b', angle: 225 },
                { name: 'Systems/Processes', grade: results.systemsProcesses || 'B', color: '#795548', angle: 270 },
                { name: 'Owner Dependency', grade: results.ownerDependency || 'C', color: '#e91e63', angle: 315 }
              ];

              const radius = 180;
              
              return drivers.map((driver, index) => {
                const angleRad = (driver.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;
                
                return (
                  <MDBox
                    key={index}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: `3px solid ${driver.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.1)`,
                        boxShadow: `0 6px 24px ${driver.color}40`
                      }
                    }}
                  >
                    <MDTypography variant="h5" fontWeight="bold" sx={{ color: driver.color }}>
                      {driver.grade}
                    </MDTypography>
                    <MDTypography variant="caption" textAlign="center" sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.5 }}>
                      {driver.name}
                    </MDTypography>
                  </MDBox>
                );
              });
            })()}
          </MDBox>

          {/* Performance Summary Cards */}
          <MDBox display="flex" gap={2} mt={6} mb={4}>
            <MDBox flex={1} p={3} sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
              <MDTypography variant="h6" fontWeight="bold" color="primary" mb={1}>
                Strengths: 4
              </MDTypography>
              <MDTypography variant="body2" color="textSecondary">
                Key competitive advantages identified
              </MDTypography>
            </MDBox>
            <MDBox flex={1} p={3} sx={{ backgroundColor: '#fff3e0', borderRadius: 2, textAlign: 'center' }}>
              <MDTypography variant="h6" fontWeight="bold" color="warning" mb={1}>
                Opportunities: 4
              </MDTypography>
              <MDTypography variant="body2" color="textSecondary">
                Areas for strategic improvement
              </MDTypography>
            </MDBox>
            <MDBox flex={1} p={3} sx={{ backgroundColor: '#e8f5e8', borderRadius: 2, textAlign: 'center' }}>
              <MDTypography variant="h6" fontWeight="bold" color="success" mb={1}>
                Value Multiple: {results.valuationMultiple || '4.2'}x
              </MDTypography>
              <MDTypography variant="body2" color="textSecondary">
                Industry-adjusted EBITDA multiple
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Strategic Insights */}
          <MDBox p={4} sx={{ 
            background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)', 
            borderRadius: 3, 
            color: 'white',
            textAlign: 'center'
          }}>
            <MDTypography variant="h6" fontWeight="bold" mb={2} sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Strategic Assessment Summary
            </MDTypography>
            <MDTypography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '800px', mx: 'auto' }}>
              Your business demonstrates strong foundational elements with a B+ overall grade. Key strengths include 
              recurring revenue streams and experienced management, while opportunities exist in reducing owner dependency 
              and enhancing operational systems. This profile positions your business for strategic growth and value optimization.
            </MDTypography>
            <MDBox mt={3}>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Assessment based on 25-question strategic evaluation across 11 key value drivers
              </MDTypography>
            </MDBox>
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