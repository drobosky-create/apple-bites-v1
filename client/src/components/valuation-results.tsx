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
        {/* AI Generated Executive Summary */}
        {results.executiveSummary && (
          <div className="bg-gradient-to-r from-[#0b2147]/5 to-blue-50 rounded-xl p-6 border border-[#0b2147]/20 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#0b2147] mb-3">AI-Generated Executive Summary</h4>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{results.executiveSummary}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Generated Business Analysis */}
        {results.narrativeSummary && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900 mb-3">Detailed Business Analysis</h4>
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{results.narrativeSummary}</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-[#415A77] hover:bg-[#1B263B] text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="mr-1 w-3 h-3" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Operational Grade Display */}
        <div className="bg-gradient-to-br from-[#415A77]/10 via-white to-[#1a2332]/5 border border-[#415A77]/30 rounded-lg p-4 text-center">
          <h5 className="text-base font-semibold text-[#1a2332] mb-3">Overall Operational Grade</h5>
          <div className="inline-block bg-white rounded-full p-4 shadow-lg border-2 border-[#415A77]">
            <div className="text-4xl font-bold text-[#1a2332]">{results.overallScore}</div>
          </div>
          <p className="mt-2 text-[#1a2332]/70 text-sm font-medium">With an Operational Grade of {results.overallScore}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <h5 className="font-semibold text-slate-900 mb-2 text-xl">Financial Summary</h5>
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
            <h5 className="font-semibold text-slate-900 mb-2 text-xl">Top Drivers</h5>
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

        {/* Strategy Session CTA */}
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


        </div>


      </div>
    </div>
  );
}
