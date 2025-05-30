import InteractiveValuationSlider from "@/components/interactive-valuation-slider";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import type { ValuationAssessment } from "@shared/schema";

export default function ValueCalculator() {
  const [, setLocation] = useLocation();
  
  // Check if user has completed at least one assessment
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
  });

  const hasCompletedAssessment = assessments && assessments.length > 0;

  useEffect(() => {
    // If no assessments and not loading, redirect to valuation form
    if (!isLoading && !hasCompletedAssessment) {
      setLocation('/valuation-form');
    }
  }, [isLoading, hasCompletedAssessment, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no assessments found
  if (!hasCompletedAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Assessment Required
          </h2>
          <p className="text-slate-600 mb-6">
            You need to complete a business valuation assessment before accessing the value improvement calculator.
          </p>
          <Button 
            onClick={() => setLocation('/valuation-form')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Valuation Assessment
          </Button>
        </div>
      </div>
    );
  }

  return <InteractiveValuationSlider />;
}