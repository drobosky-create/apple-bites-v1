import { ValuationAssessment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Calendar, Mail, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import ValueDriversHeatmap from "./value-drivers-heatmap";

interface ValuationResultsProps {
  results: ValuationAssessment;
}

export default function ValuationResults({ results }: ValuationResultsProps) {
  const [, setLocation] = useLocation();

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/valuation/${results.id}/download-pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${results.company || 'Business'}_Valuation_Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleScheduleConsultation = () => {
    // Open GoHighLevel calendar widget in a new window
    window.open('https://api.leadconnectorhq.com/widget/bookings/scheduleanappointmentcallwithus-230ad544-8f6f-4125-9d14-f1b202f0becc-7fdb3832-39a9-4c80-a146-60233fb444a1-aaa07f1f-456b-4ccc-81e4-adb0ad437aa3-0b2d0529-cb48-461f-b8b5-712b398e91eb-fcbf65a8-70d2-4009-b786-ac4166822f0b-0f63997e-5577-46ae-9f21-00d7deb09698-236c7ec4-83c2-48f3-8aac-f523237ed3b4', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  const handleExploreImprovements = () => {
    // Redirect to value calculator with current grade data prefilled
    setLocation(`/value-calculator?grade=${results.overallScore}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-screen flex flex-col">
      <div className="p-3 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Valuation Complete</h3>
            <p className="text-xs text-slate-600">Your business valuation report has been generated successfully.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {/* Valuation Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-4 border border-primary/20">
          <h4 className="text-xl font-bold text-slate-900 mb-3">Estimated Business Value</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563eb]">{formatCurrency(results.lowEstimate)}</div>
              <div className="text-xs text-slate-600 mt-1">Low Estimate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{formatCurrency(results.midEstimate)}</div>
              <div className="text-xs text-slate-600 mt-1">Most Likely</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563eb]">{formatCurrency(results.highEstimate)}</div>
              <div className="text-xs text-slate-600 mt-1">High Estimate</div>
            </div>
          </div>
          
          {/* Primary CTAs after valuation */}
          <div className="mt-4">
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleDownloadPDF}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Download className="mr-1 w-3 h-3" />
                Download Full Report
              </Button>

              <Button 
                onClick={handleExploreImprovements}
                variant="outline"
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
              >
                <Calculator className="mr-1 w-3 h-3" />
                Explore Value Improvements
              </Button>

              <Button 
                onClick={handleScheduleConsultation}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="mr-1 w-3 h-3" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Operational Grade Display */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 border border-emerald-200 rounded-lg p-4 text-center">
          <h5 className="text-base font-semibold text-slate-900 mb-3">Overall Operational Grade</h5>
          <div className="inline-block bg-white rounded-full p-4 shadow-lg border-2 border-emerald-300">
            <div className="text-4xl font-bold text-emerald-600">{results.overallScore}</div>
          </div>
          <p className="mt-2 text-slate-600 text-sm font-medium">With an Operational Grade of {results.overallScore}</p>
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
                  <a href="mailto:info@meritage-partners.com" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>info@meritage-partners.com</span>
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

        {/* Detailed Analysis */}
        {results.narrativeSummary && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h5 className="font-semibold text-slate-900 mb-4">Detailed Analysis</h5>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">{results.narrativeSummary}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h5 className="font-semibold text-slate-900 mb-4">Your Valuation Report</h5>
          <p className="text-slate-600 mb-6">A comprehensive PDF report has been generated with detailed analysis, benchmarking data, and recommendations for improving your business value.</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadPDF}
              className="flex-1 btn-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center"
              disabled={!results.pdfUrl}
            >
              <Download className="mr-2 w-4 h-4" />
              Download Full Report
            </Button>

            <Button 
              onClick={handleExploreImprovements}
              variant="outline"
              className="flex-1 px-6 py-3 rounded-lg font-medium border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
            >
              <Calculator className="mr-2 w-4 h-4" />
              Explore Value Improvements
            </Button>

            <Button 
              onClick={handleScheduleConsultation}
              className="flex-1 px-6 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Calendar className="mr-2 w-4 h-4" />
              Schedule Consultation
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Report Sent</p>
                <p>A copy of your valuation report has been emailed to <span className="font-medium">{results.email}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
