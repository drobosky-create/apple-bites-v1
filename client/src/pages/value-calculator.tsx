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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header Section with Argon styling */}
        <div className="mb-12 sm:mb-20 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#0F172A] tracking-wide leading-tight">
              Value Improvement Calculator
            </h1>
            <p className="text-lg sm:text-xl text-[#64748B] max-w-3xl leading-relaxed font-medium">
              Explore how improving your operational grades affects your business valuation and discover opportunities for growth
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation('/results')}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 px-6 py-3 rounded-full font-semibold text-[#0F172A] w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Assessment
          </Button>
        </div>

        {/* Main Calculator Container with Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-900/10 border border-white/30 p-6 sm:p-12 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 pointer-events-none" />
          
          <div className="relative z-10">
            <InteractiveValuationSlider />
          </div>
        </div>
      </div>
    </div>
  );
}