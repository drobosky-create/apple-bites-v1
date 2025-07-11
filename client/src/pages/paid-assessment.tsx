import { usePaidValuationForm } from "@/hooks/use-paid-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import IndustryForm from "@/components/industry-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import appleBitesLogo from "@assets/Apple Bites_1752266454888.png";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ValuationAssessment } from "@shared/schema";

export default function PaidAssessment() {
  const [location] = useLocation();
  const [industryData, setIndustryData] = useState({
    naicsCode: '',
    industryDescription: '',
    foundingYear: new Date().getFullYear(),
    businessModel: '',
    competitiveAdvantage: ''
  });
  
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
  } = usePaidValuationForm();

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

    const latestAssessment = assessments?.[0];
    if (!latestAssessment) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">No assessment found. Please complete an assessment first.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="mt-4"
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
        <div className="container mx-auto px-4">
          <ValuationResults results={latestAssessment} />
        </div>
      </div>
    );
  }

  const handleIndustryDataSubmit = () => {
    // Submit assessment with paid tier and industry data
    const enhancedData = {
      ...formData,
      tier: 'paid',
      industryData
    };
    submitAssessment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
      <main className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        {/* Header with Apple Bites Logo */}
        {currentStep !== "results" && (
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-8 text-center sm:text-left">
            <img 
              src={appleBitesLogo} 
              alt="Apple Bites Business Assessment" 
              className="h-12 sm:h-20 w-auto mb-3 sm:mb-0 sm:mr-4"
            />
            <div>
              <h1 className="text-lg sm:text-3xl font-bold text-gray-900">Strategic Business Assessment</h1>
              <Badge className="mt-2 bg-[#415A77] text-white">Professional Analysis - $395</Badge>
            </div>
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
              // Move to industry data collection for paid tier
              nextStep();
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("followUp", data)}
            isSubmitting={false}
          />
        )}

        {currentStep === "tierSelection" && (
          <Card className="border-2 border-[#415A77] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#415A77]/10 to-blue-100/50">
              <CardTitle className="text-2xl text-[#1a2332] flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Strategic Analysis Details
              </CardTitle>
              <p className="text-slate-600">
                To provide the most accurate industry-specific valuation, please provide additional details about your business.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="naicsCode" className="text-sm font-medium text-slate-700">
                    NAICS Code (Optional)
                  </Label>
                  <Input
                    id="naicsCode"
                    placeholder="e.g., 541511"
                    value={industryData.naicsCode}
                    onChange={(e) => setIndustryData({...industryData, naicsCode: e.target.value})}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    North American Industry Classification System code
                  </p>
                </div>

                <div>
                  <Label htmlFor="foundingYear" className="text-sm font-medium text-slate-700">
                    Founding Year
                  </Label>
                  <Input
                    id="foundingYear"
                    type="number"
                    placeholder="e.g., 2015"
                    value={industryData.foundingYear}
                    onChange={(e) => setIndustryData({...industryData, foundingYear: parseInt(e.target.value) || new Date().getFullYear()})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industryDescription" className="text-sm font-medium text-slate-700">
                  Industry Description
                </Label>
                <Textarea
                  id="industryDescription"
                  placeholder="Describe your industry and business model in detail..."
                  value={industryData.industryDescription}
                  onChange={(e) => setIndustryData({...industryData, industryDescription: e.target.value})}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="competitiveAdvantage" className="text-sm font-medium text-slate-700">
                  Competitive Advantage
                </Label>
                <Textarea
                  id="competitiveAdvantage"
                  placeholder="What sets your business apart from competitors?"
                  value={industryData.competitiveAdvantage}
                  onChange={(e) => setIndustryData({...industryData, competitiveAdvantage: e.target.value})}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleIndustryDataSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#415A77] text-white hover:bg-[#1B263B] font-semibold"
                >
                  Generate Strategic Report - $395
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "results" && results && (
          <ValuationResults results={results} />
        )}
      </main>
      <LoadingModal 
        isVisible={isSubmitting} 
        message="Generating your strategic analysis with industry-specific insights..."
      />
    </div>
  );
}