import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Download, ArrowLeft, TrendingUp, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import calculateValuation from "@/utils/valuationEngine";
import AICoachingTips from '@/components/AICoachingTips';

export default function AssessmentResults() {
  const [, setLocation] = useLocation();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [valuationResults, setValuationResults] = useState<any>(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  useEffect(() => {
    // Check if payment is verified and load assessment data
    const paymentVerified = localStorage.getItem('paymentVerified');
    const storedData = localStorage.getItem('verifiedAssessmentData') || localStorage.getItem('growthExitAssessmentData');
    
    if (paymentVerified === 'true' && storedData) {
      try {
        const data = JSON.parse(storedData);
        setAssessmentData(data);
        setIsPaymentVerified(true);
        
        // Calculate valuation results
        const results = calculateValuation(data);
        setValuationResults(results);
      } catch (error) {
        console.error('Error parsing assessment data:', error);
        setLocation('/assessment-access');
      }
    } else {
      // Redirect to access page if no verified data
      setLocation('/assessment-access');
    }
  }, [setLocation]);

  const handleDownloadReport = () => {
    // TODO: Generate and download PDF report
    console.log('Generating PDF report...');
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  if (!assessmentData || !valuationResults || !isPaymentVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <Badge className="bg-green-100 text-green-800">Payment Verified</Badge>
          </div>
        </div>

        {/* Results Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Growth & Exit Assessment Results</h1>
          <p className="text-gray-600">Comprehensive business valuation and strategic insights</p>
        </div>

        {/* Valuation Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Business Valuation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${valuationResults.valuation.mean.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Estimated Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${valuationResults.ebitda.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Adjusted EBITDA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {valuationResults.ebitda > 0 ? (valuationResults.valuation.mean / valuationResults.ebitda).toFixed(1) : 'N/A'}x
                </div>
                <div className="text-sm text-gray-600">EBITDA Multiple</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Coaching Tips */}
        {assessmentData.valueDrivers && (
          <AICoachingTips 
            valueDrivers={assessmentData.valueDrivers}
            financialData={{
              ebitda: valuationResults.ebitda,
              revenue: parseFloat(assessmentData.financials?.annualRevenue || '0'),
              valuation: valuationResults.valuation.mean
            }}
            naicsCode={assessmentData.naicsCode}
          />
        )}

        {/* Download Report */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Professional Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Your comprehensive assessment report includes detailed analysis, industry comparisons, and strategic recommendations.
              </p>
              <Button 
                onClick={handleDownloadReport}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Full Report (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}