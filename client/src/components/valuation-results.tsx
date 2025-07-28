import { ValuationAssessment } from "@shared/schema";
import { CheckCircle, Calendar, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import ValueDriversHeatmap from "./value-drivers-heatmap";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

interface ValuationResultsProps {
  results: ValuationAssessment;
}

export default function ValuationResults({ results }: ValuationResultsProps) {
  const [, setLocation] = useLocation();

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    const numValue = parseFloat(value);
    
    // Format for different value ranges with decimals
    if (numValue >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(numValue);
    } else if (numValue >= 1000) {
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



  const handleScheduleConsultation = () => {
    // Open GoHighLevel calendar widget in a new window
    window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  const handleExploreImprovements = () => {
    // Redirect to value calculator with specific assessment ID
    setLocation(`/value-calculator?assessmentId=${results.id}`);
  };

  return (
    <div >
      <div >
        <div >
          <div >
            <CheckCircle  />
          </div>
          <div>
            <h3 >Valuation Complete</h3>
            <p >Your business valuation report has been generated successfully.</p>
          </div>
        </div>
      </div>
      <div >
        {/* AI Generated Executive Summary */}
        {results.executiveSummary && (
          <div >
            <div >
              <div >
                <svg  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div >
                <h4 >AI-Generated Executive Summary</h4>
                <div >
                  <p >{results.executiveSummary}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Generated Business Analysis */}
        {results.narrativeSummary && (
          <div >
            <div >
              <div >
                <svg  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div >
                <h4 >Detailed Business Analysis</h4>
                <div >
                  <div >{results.narrativeSummary}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valuation Summary */}
        <div >
          <h4 >Estimated Business Value</h4>
          <div >
            <div >
              <div >
                <div >{formatCurrency(results.lowEstimate)}</div>
                <div >Low Estimate</div>
              </div>
              <div >
                <div >{formatCurrency(results.midEstimate)}</div>
                <div >Most Likely</div>
              </div>
              <div >
                <div >{formatCurrency(results.highEstimate)}</div>
                <div >High Estimate</div>
              </div>
            </div>
          </div>
          
          {/* Primary CTAs after valuation */}
          <div >
            <div >
              <MDButton 
                onClick={handleExploreImprovements}
                variant="outlined"
                color="info"
                startIcon={<Calculator size={16} />}
                sx={{ mr: 2 }}
              >
                Explore Value Improvements
              </MDButton>

              <MDButton 
                onClick={handleScheduleConsultation}
                variant="gradient"
                color="primary"
                startIcon={<Calendar size={16} />}
              >
                Schedule Consultation
              </MDButton>
            </div>
          </div>
        </div>

        {/* Operational Grade Display */}
        <div >
          <h5 >Overall Operational Grade</h5>
          <div >
            <div >{results.overallScore}</div>
          </div>
          <p >With an Operational Grade of {results.overallScore}</p>
        </div>

        {/* Key Metrics */}
        <div >
          <div >
            <h5 >Financial Summary</h5>
            <div >
              <div >
                <span >Adjusted EBITDA</span>
                <span >{formatCurrency(results.adjustedEbitda)}</span>
              </div>
              <div >
                <span >Multiple</span>
                <span >{results.valuationMultiple}x</span>
              </div>
            </div>
          </div>

          <div >
            <h5 >Top Drivers</h5>
            <div >
              <div >
                <span >Growth</span>
                <span >{results.growthProspects}</span>
              </div>
              <div >
                <span >Financial</span>
                <span >{results.financialPerformance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Session CTA */}
        <div >
          <div >
            <h5 >Schedule Your Strategy Session</h5>
            <div >
              <MDButton 
                onClick={handleScheduleConsultation}
                variant="gradient"
                color="success"
                startIcon={<Calendar size={16} />}
                size="large"
              >
                Schedule Your Strategy Session
              </MDButton>
            </div>
            <p >
              No obligation • 30-minute consultation • Expert M&A guidance
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
