import { useValuationForm } from "@/hooks/use-valuation-form";
import { useEffect } from "react";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
import AssessmentStepper from "@/components/AssessmentStepper";
import { 
  ArrowLeft, 
  Home, 
  User, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  Calculator,
  TrendingUp,
  MessageCircle,
  DollarSign
} from "lucide-react";


import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
const appleBitesLogo = '/assets/logos/apple-bites-logo-variant-4.png';
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

// Material Dashboard Styled Components
const AssessmentBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
    padding: '12px',
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}));



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
  
  const { user, isAuthenticated } = useAuth();

  // Check if authenticated user has complete profile information
  const hasCompleteProfile = isAuthenticated && user && 
    (user as any).firstName && 
    (user as any).lastName && 
    (user as any).email;

  // Auto-populate contact form and skip to EBITDA if user has complete profile
  useEffect(() => {
    if (hasCompleteProfile && currentStep === 'contact') {
      // Auto-populate contact form with user data
      const contactData = {
        firstName: (user as any).firstName,
        lastName: (user as any).lastName,
        email: (user as any).email,
        phone: (user as any).phone || '',
        company: (user as any).company || '',
        jobTitle: (user as any).jobTitle || ''
      };
      
      // Update form data and skip to next step
      updateFormData('contact', contactData);
      setTimeout(() => nextStep(), 100); // Small delay to ensure form data is set
    }
  }, [hasCompleteProfile, currentStep, user, updateFormData, nextStep]);

  // Helper function to convert step name to index
  const getStepIndex = (step: FormStep): number => {
    const stepMap = {
      ebitda: 0, 
      adjustments: 1,
      valueDrivers: 2,
      followUp: 3,
      results: 3
    };
    return stepMap[step] || 0;
  };

  // If we're on /results route, show loading or latest assessment
  if (location === '/results') {
    if (assessmentsLoading) {
      return (
        <div >
          <div >
            <div ></div>
            <p >Loading your assessment results...</p>
          </div>
        </div>
      );
    }

    const latestAssessment = assessments?.[0];
    if (!latestAssessment) {
      return (
        <div >
          <div >
            <p >No assessment found. Please complete an assessment first.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div >
        <div >
          <ValuationResults results={latestAssessment} />
        </div>
      </div>
    );
  }



  return (
    <AssessmentBackground>
      {/* Main Content Area */}
      <MainContent>
        {/* Assessment Stepper */}
        <AssessmentStepper activeStep={getStepIndex(currentStep)} />
        
        <FormCard>
          <CardContent sx={{ p: 3, minHeight: '500px' }}>
            {/* Form Content */}
            <Box>
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
            </Box>
          </CardContent>
        </FormCard>
      </MainContent>

      <LoadingModal 
        isVisible={isSubmitting} 
        message="Analyzing your business data and calculating valuation..."
      />
    </AssessmentBackground>
  );
}