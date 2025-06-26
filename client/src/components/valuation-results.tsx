import { ValuationAssessment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import ValueDriversHeatmap from "./value-drivers-heatmap";

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
    // Redirect to value calculator with current grade data prefilled
    setLocation(`/value-calculator?grade=${results.overallScore}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-screen flex flex-col max-w-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Valuation Complete</h3>
            <p className="text-sm text-slate-600">Your business valuation report has been generated successfully.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-w-full">
        {/* Valuation Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-4 border border-primary/20">
          <h4 className="text-xl font-bold text-slate-900 mb-3">Estimated Business Value</h4>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center min-w-0">
                <div className="text-sm sm:text-2xl font-bold text-[#2563eb] break-words">{formatCurrency(results.lowEstimate)}</div>
                <div className="text-xs text-slate-600 mt-1">Low Estimate</div>
              </div>
              <div className="text-center min-w-0">
                <div className="text-base sm:text-3xl font-bold text-slate-900 break-words">{formatCurrency(results.midEstimate)}</div>
                <div className="text-xs text-slate-600 mt-1">Most Likely</div>
              </div>
              <div className="text-center min-w-0">
                <div className="text-sm sm:text-2xl font-bold text-[#2563eb] break-words">{formatCurrency(results.highEstimate)}</div>
                <div className="text-xs text-slate-600 mt-1">High Estimate</div>
              </div>
            </div>
          </div>
          
          {/* Primary CTAs after valuation */}
          <div className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleExploreImprovements}
                variant="outline"
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white flex items-center justify-center"
              >
                <Calculator className="mr-1 w-3 h-3" />
                Explore Value Improvements
              </Button>

              <Button 
                onClick={handleScheduleConsultation}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-[#f5c842] hover:bg-[#e6b63a] text-[#1a2332] flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="mr-1 w-3 h-3" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Operational Grade Display */}
        <div className="bg-gradient-to-br from-[#f5c842]/10 via-white to-[#1a2332]/5 border border-[#f5c842]/30 rounded-lg p-4 text-center">
          <h5 className="text-base font-semibold text-[#1a2332] mb-3">Overall Operational Grade</h5>
          <div className="inline-block bg-white rounded-full p-4 shadow-lg border-2 border-[#f5c842]">
            <div className="text-4xl font-bold text-[#1a2332]">{results.overallScore}</div>
          </div>
          <p className="mt-2 text-[#1a2332]/70 text-sm font-medium">With an Operational Grade of {results.overallScore}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <h5 className="font-semibold text-slate-900 mb-2 text-sm">Financial Summary</h5>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Adjusted EBITDA</span>
                <span className="font-medium">{formatCurrency(results.adjustedEbitda)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Multiple</span>
                <span className="font-medium">{results.valuationMultiple}x</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <h5 className="font-semibold text-slate-900 mb-2 text-sm">Top Drivers</h5>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Growth</span>
                <span className="text-green-600 font-medium">{results.growthProspects}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Financial</span>
                <span className="text-primary font-medium">{results.financialPerformance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {results.executiveSummary && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="mb-4">
              <h5 className="text-base font-bold text-slate-900 mb-3 text-center">Schedule Your Strategy Session</h5>
              <div className="flex justify-center mb-3">
                <Button 
                  onClick={handleScheduleConsultation}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="mr-2 w-4 h-4" />
                  Schedule Your Strategy Session
                </Button>
              </div>
              <p className="text-center text-slate-500 text-xs">
                No obligation • 30-minute consultation • Expert M&A guidance
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-200">
              <div className="bg-slate-50 rounded-lg p-3">
                <h6 className="font-semibold text-slate-900 mb-2 text-sm">Dear {results.firstName},</h6>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <p className="mb-2">
                    Thank you for completing our comprehensive business valuation assessment 
                    for <strong>{results.company}</strong>. We've analyzed your business across multiple value 
                    drivers and prepared this detailed report with our findings.
                  </p>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-slate-800 font-medium mb-1 text-xs">Best regards,</p>
                <p className="text-blue-600 font-bold text-sm">The Meritage Partners Team</p>
                <p className="text-slate-600 text-xs">M&A Advisory & Business Valuation Experts</p>
                <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
                  <a href="mailto:info@meritage-partners.com" className="text-blue-600 hover:text-blue-700">
                    info@meritage-partners.com
                  </a>
                  <span className="text-slate-400">|</span>
                  <a href="tel:+19495229121" className="text-blue-600 hover:text-blue-700">
                    (949) 522-9121
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
