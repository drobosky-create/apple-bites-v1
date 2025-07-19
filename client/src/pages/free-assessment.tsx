import { useValuationForm } from "@/hooks/use-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import { ArrowLeft, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import appleBitesLogo from "@assets/Apple Bites_1752266454888.png";
import meritagePartnersLogo from "@assets/Meritage Logo.png";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";

import _3 from "@assets/3.png";

import Apple_Bites__1_ from "@assets/Apple Bites (1).png";

import _4 from "@assets/4.png";

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
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Authentic Argon Dashboard Header */}
      <ArgonBox
        variant="gradient"
        bgGradient="primary"
        py={3}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
            </div>
            <div className="flex items-center space-x-4">
              <ArgonButton
                variant="outlined"
                color="white"
                size="medium"
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </ArgonButton>
              <ArgonButton
                variant="outlined"
                color="white"
                size="medium"
                onClick={() => window.location.href = '/login'}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Admin Login</span>
              </ArgonButton>
            </div>
          </div>
        </div>
      </ArgonBox>
      <main className="container mx-auto px-4 max-w-7xl py-8">
        {/* New Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Stepper */}
          {currentStep !== "results" && (
            <aside className="bg-gradient-to-br from-[#0b2147] to-[#1a365d] text-white rounded-xl p-6 sticky top-4 h-fit">
              <div className="text-center mb-6">
                <img 
                  src={_4} 
                  alt="Apple Bites" 
                  className="h-[250px] w-auto mx-auto mb-3 brightness-25"
                />
                
                <p className="text-sm text-slate-300 mt-1">Professional Valuation</p>
              </div>
              <ProgressIndicator currentStep={currentStep} />
            </aside>
          )}

          {/* Main Form Content */}
          <section className={`bg-white rounded-xl shadow-lg ${currentStep === "results" ? "col-span-full" : ""}`}>
            <ArgonBox p={8}>
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
            </ArgonBox>
          </section>
        </div>
      </main>
      <LoadingModal 
        isVisible={isSubmitting} 
        message="Analyzing your business data and calculating valuation..."
      />
    </div>
  );
}