import { useValuationForm } from "@/hooks/use-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import appleBitesLogo from "@assets/Apple Bites_1752266454888.png";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";

// Helper function to get step number
const getStepNumber = (step: string): number => {
  const steps = ["contact", "ebitda", "adjustments", "valueDrivers", "followup"];
  return steps.indexOf(step) + 1;
};

export default function FreeAssessment() {
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
        <div className="min-h-screen bg-gradient-to-br from-ghl-navy to-ghl-navy-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghl-primary mx-auto mb-4"></div>
            <p className="text-white/80">Loading your assessment results...</p>
          </div>
        </div>
      );
    }

    const latestAssessment = assessments?.[0];
    if (!latestAssessment) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-ghl-navy to-ghl-navy-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/80">No assessment found. Please complete an assessment first.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="mt-4 ghl-primary-button"
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-ghl-navy to-ghl-navy-dark py-4">
        <div className="container mx-auto px-4">
          <ValuationResults results={latestAssessment} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghl-navy to-ghl-navy-dark py-6">
      <main className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-20">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        {/* Header with Apple Bites Logo and Progress Navigation */}
        {currentStep !== "results" && (
          <div className="mb-8">
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-center sm:text-left">
              <img 
                src={appleBitesLogo} 
                alt="Apple Bites Business Assessment" 
                className="h-15 sm:h-20 w-auto mb-3 sm:mb-0 sm:mr-4"
              />
              <div>
                <h1 className="text-lg sm:text-3xl font-bold text-white">Apple Bites Business Assessment</h1>
                <Badge className="mt-2 bg-ghl-primary text-white">Free Basic Analysis</Badge>
              </div>
            </div>
            
            {/* Progress Navigation in 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Assessment Progress
                </h2>
                <div className="text-white/80 text-sm">
                  Complete each step to get your business valuation
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 mb-2">
                  Step {getStepNumber(currentStep)} of 5
                </div>
                <ProgressIndicator currentStep={currentStep} />
              </div>
            </div>
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
              // Submit assessment with free tier
              submitAssessment();
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("followUp", data)}
            isSubmitting={isSubmitting}
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