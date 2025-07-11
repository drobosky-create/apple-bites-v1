import { useValuationForm } from "@/hooks/use-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import TierSelectionForm from "@/components/tier-selection-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import appleBitesLogo from "@assets/Apple Bites_1752266454888.png";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";

export default function ValuationForm() {
  const [location] = useLocation();
  
  // Check if we're on the results route and fetch latest assessment
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: location === '/results'
  });

  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    calculateEbitda,
    calculateAdjustedEbitda,
    submitAssessment,
    results,
    isSubmitting,
    forms,
  } = useValuationForm();

  // If we're on /results route, show loading or latest assessment
  if (location === '/results') {
    if (assessmentsLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your assessment results...</p>
          </div>
        </div>
      );
    }
    
    if (assessments && assessments.length > 0) {
      const latestAssessment = assessments[assessments.length - 1];
      return <ValuationResults results={latestAssessment} />;
    }
    
    // If no assessments found, redirect to form
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Assessment Found</h2>
          <p className="text-slate-600 mb-6">Complete a valuation assessment to view results.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        
        {/* Header with Apple Bites Logo */}
        {currentStep !== "results" && (
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-8 text-center sm:text-left">
            <img 
              src={appleBitesLogo} 
              alt="Apple Bites Business Assessment" 
              className="h-12 sm:h-20 w-auto mb-3 sm:mb-0 sm:mr-4"
            />
            <h1 className="text-lg sm:text-3xl font-bold text-gray-900">Apple Bites Business Assessment</h1>
          </div>
        )}

        {currentStep !== "results" && (
          <div className="mb-4 sm:mb-8">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        )}

        {currentStep === "contact" && (
          <ContactForm
            form={forms.contact}
            onNext={nextStep}
            onDataChange={(data) => updateFormData("contact", data)}
          />
        )}

        {currentStep === "ebitda" && (
          <EbitdaForm
            form={forms.ebitda}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("ebitda", data)}
            calculateEbitda={calculateEbitda}
          />
        )}

        {currentStep === "adjustments" && (
          <AdjustmentsForm
            form={forms.adjustments}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("adjustments", data)}
            calculateAdjustedEbitda={calculateAdjustedEbitda}
            baseEbitda={calculateEbitda()}
          />
        )}

        {currentStep === "valueDrivers" && (
          <ValueDriversForm
            form={forms.valueDrivers}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("valueDrivers", data)}
          />
        )}

        {currentStep === "followUp" && (
          <FollowUpForm
            form={forms.followUp}
            onSubmit={() => {
              // Don't submit assessment yet, move to tier selection
              nextStep();
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("followUp", data)}
            isSubmitting={false}
          />
        )}

        {currentStep === "tierSelection" && (
          <TierSelectionForm
            formData={formData}
            onFreeReport={() => {
              // Submit assessment with free tier
              submitAssessment();
            }}
            onPaidReport={() => {
              // Submit assessment with paid tier  
              submitAssessment();
            }}
            onPrev={prevStep}
          />
        )}

        {currentStep === "results" && results && (
          <ValuationResults results={results} />
        )}
      </main>
      <LoadingModal 
        isVisible={isSubmitting} 
        message="Analyzing your business data and calculating valuation..."
      />
    </div>
  );
}
