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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Valuation Complete</h3>
            <p className="text-slate-600">Your business valuation report has been generated successfully.</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Valuation Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-6 border border-primary/20">
          <h4 className="text-2xl font-bold text-slate-900 mb-4">Estimated Business Value</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2563eb]">{formatCurrency(results.lowEstimate)}</div>
              <div className="text-sm text-slate-600 mt-1">Low Estimate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{formatCurrency(results.midEstimate)}</div>
              <div className="text-sm text-slate-600 mt-1">Most Likely</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2563eb]">{formatCurrency(results.highEstimate)}</div>
              <div className="text-sm text-slate-600 mt-1">High Estimate</div>
            </div>
          </div>
          
          {/* Primary CTAs after valuation */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadPDF}
                className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Full Report
              </Button>

              <Button 
                onClick={handleExploreImprovements}
                variant="outline"
                className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
              >
                <Calculator className="mr-2 w-4 h-4" />
                Explore Value Improvements
              </Button>

              <Button 
                onClick={handleScheduleConsultation}
                className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="mr-2 w-4 h-4" />
                Schedule Consultation
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-3 text-center">
              Download your detailed report, explore improvement opportunities, or schedule a consultation
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h5 className="font-semibold text-slate-900 mb-4">Financial Summary</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Adjusted EBITDA</span>
                <span className="font-medium">{formatCurrency(results.adjustedEbitda)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valuation Multiple</span>
                <span className="font-medium">{results.valuationMultiple}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Overall Score</span>
                <span className="font-medium">{results.overallScore}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h5 className="font-semibold text-slate-900 mb-4">Value Driver Highlights</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Growth Prospects</span>
                <span className="text-green-600 font-medium">{results.growthProspects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Financial Performance</span>
                <span className="text-primary font-medium">{results.financialPerformance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Competitive Position</span>
                <span className="text-primary font-medium">{results.competitivePosition}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Value Drivers Heatmap */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <ValueDriversHeatmap assessment={results} />
        </div>

        {/* Operational Grade Display */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 border border-emerald-200 rounded-lg p-8 text-center">
          <h5 className="text-lg font-semibold text-slate-900 mb-6">Overall Operational Grade</h5>
          <div className="inline-block bg-white rounded-full p-8 shadow-lg border-2 border-emerald-300">
            <div className="text-6xl font-bold text-emerald-600">{results.overallScore}</div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">With an Operational Grade of {results.overallScore}</p>
        </div>

        {/* Executive Summary */}
        {results.executiveSummary && (
          <div className="bg-white border border-slate-200 rounded-lg p-8">
            <div className="mb-8">
              <h5 className="text-xl font-bold text-slate-900 mb-6 text-center">Schedule Your Strategy Session</h5>
              <p className="text-center text-slate-600 mb-6 text-lg leading-relaxed">
                Ready to unlock your business's full potential? Book a complimentary 
                strategy session with our M&A experts to discuss your valuation 
                results and explore value enhancement opportunities.
              </p>
              <div className="flex justify-center mb-8">
                <Button 
                  onClick={handleScheduleConsultation}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="mr-3 w-5 h-5" />
                  Schedule Your Strategy Session
                </Button>
              </div>
              <p className="text-center text-slate-500 text-sm">
                No obligation • 30-minute consultation • Expert M&A guidance
              </p>
            </div>
            
            <div className="pt-8 border-t border-slate-200">
              <p className="text-slate-600 leading-relaxed mb-6">
                This detailed analysis provides insights into your business's current position and 
                highlights specific areas where strategic improvements could significantly increase 
                your company's value.
              </p>
              
              <div className="mb-8">
                <p className="text-slate-800 font-medium mb-4">Best regards,</p>
                <p className="text-blue-600 font-bold text-lg">The Meritage Partners Team</p>
                <p className="text-slate-600 mt-2">M&A Advisory & Business Valuation Experts</p>
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <a href="mailto:info@meritage-partners.com" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@meritage-partners.com</span>
                  </a>
                  <span className="text-slate-400">|</span>
                  <a href="tel:+19495229121" className="text-blue-600 hover:text-blue-700">
                    (949) 522-9121
                  </a>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h6 className="font-semibold text-slate-900 mb-4">Dear {results.firstName},</h6>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                    Thank you for completing our comprehensive business valuation assessment 
                    for <strong>{results.company}</strong>. We've analyzed your business across multiple value 
                    drivers and prepared this detailed report with our findings.
                  </p>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{results.executiveSummary}</p>
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
              variant="outline"
              className="flex-1 px-6 py-3 rounded-lg font-medium border-primary text-primary hover:bg-primary/5 flex items-center justify-center"
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
