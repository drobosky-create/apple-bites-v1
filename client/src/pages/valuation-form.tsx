import { useValuationForm } from "@/hooks/use-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import appleBitesLogo from "@assets/Apple Bites Business Assessment V2_1750116954168.png";

import _2 from "@assets/2.png";

export default function ValuationForm() {
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

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        
        {/* Header with Apple Bites Logo */}
        {currentStep !== "results" && (
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-8 text-center sm:text-left">
            <img 
              src={_2} 
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
            onSubmit={submitAssessment}
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
