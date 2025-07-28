import { useValuationForm } from "@/hooks/use-valuation-form";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingModal from "@/components/loading-modal";
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
  padding: '24px',
  marginLeft: '328px', // 280px sidebar + 48px margins
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: '16px',
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}));

const StepIcon = styled(Box)<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: completed 
    ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' 
    : active 
    ? 'linear-gradient(135deg, #05cef4 0%, #0b2147 100%)' 
    : 'linear-gradient(135deg, #f5f5f5 0%, #e3e6ea 100%)',
  color: completed || active ? 'white' : '#67748e',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  border: 'none',
  boxShadow: completed || active 
    ? '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' 
    : '0 2px 6px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  '&::before': completed || active ? {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '50%',
    background: completed 
      ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' 
      : 'linear-gradient(135deg, #05cef4 0%, #0b2147 100%)',
    opacity: 0.3,
    zIndex: -1,
  } : {},
  '&:hover': {
    transform: active || completed ? 'scale(1.05)' : 'scale(1.02)',
    boxShadow: completed || active 
      ? '0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15)' 
      : '0 4px 10px rgba(0, 0, 0, 0.12)',
  }
}));

const StepConnector = styled(Box)(({ theme }) => ({
  width: '2px',
  height: '40px',
  backgroundColor: '#e3e6ea',
  marginLeft: '23px',
}));

const SidebarCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
  }
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

  const steps = [
    { id: 'contact', label: 'Contact Info', icon: User, description: 'Basic information' },
    { id: 'ebitda', label: 'Financial Data', icon: DollarSign, description: 'Revenue & EBITDA' },
    { id: 'adjustments', label: 'Adjustments', icon: Calculator, description: 'Owner benefits' },
    { id: 'valueDrivers', label: 'Value Drivers', icon: BarChart3, description: 'Business scoring' },
    { id: 'followUp', label: 'Follow-up', icon: MessageCircle, description: 'Final details' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Apple Bites Brand Colors
  const colors = {
    primary: "#00BFA6",
    secondary: "#0A1F44", 
    accent: "#5EEAD4",
    grayLight: "#F7FAFC",
    gray: "#CBD5E1"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)",
    dark: "linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)",
    glow: "linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)"
  };

  return (
    <AssessmentBackground>
      {/* Pillbox Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          width: 280,
          height: 'calc(100vh - 48px)',
          background: gradients.dark,
          borderRadius: '20px',
          border: `1px solid rgba(255, 255, 255, 0.15)`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}
      >
        {/* User Info Section */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" mb={2}>
            <Box 
              component="img"
              src="/apple-bites-logo.png"
              alt="Apple Bites"
              sx={{ width: '100px', height: 'auto', mb: 1 }}
            />
          </Box>
          
          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            Demo User
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} gutterBottom>
            demo@example.com
          </Typography>
          
          <Chip 
            label="Free Plan"
            size="small"
            sx={{ 
              background: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)',
              color: 'white',
              fontWeight: 'bold',
              mt: 1
            }}
          />
        </Box>

        {/* Navigation */}
        <Box mb={3}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              startIcon={<Home size={20} />}
              sx={{
                justifyContent: 'flex-start',
                color: '#dbdce1',
                textTransform: 'none',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              Dashboard
            </Button>
            
            <Button
              startIcon={<FileText size={20} />}
              sx={{
                justifyContent: 'flex-start',
                color: 'white',
                textTransform: 'none',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              New Assessment
            </Button>
            
            <Button
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              startIcon={<TrendingUp size={20} />}
              sx={{
                justifyContent: 'flex-start',
                color: '#dbdce1',
                textTransform: 'none',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Box>

        {/* Assessment Progress */}
        <Box flex={1}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              mb: 2,
              display: 'block'
            }}
          >
            Assessment Progress
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1}>
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              const StepIconComponent = step.icon;
              
              return (
                <Box key={step.id}>
                  <Box display="flex" alignItems="center" gap={2} py={0.5}>
                    <StepIcon active={isActive} completed={isCompleted}>
                      {isCompleted ? (
                        <CheckCircle size={18} />
                      ) : (
                        <StepIconComponent size={18} />
                      )}
                    </StepIcon>
                    <Box flex={1}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          lineHeight: 1.2
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '10px',
                          lineHeight: 1.1
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                    {isActive && (
                      <Chip 
                        label="Current" 
                        size="small" 
                        sx={{ 
                          backgroundColor: colors.primary,
                          color: 'white',
                          fontSize: '8px',
                          height: '16px',
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                  </Box>
                  {index < steps.length - 1 && (
                    <Box sx={{ 
                      ml: 3, 
                      height: 16, 
                      width: 2, 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 1
                    }} />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box mt="auto">
          <Box 
            component="img"
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Meritage Partners"
            sx={{ 
              width: '250px', 
              height: 'auto',
              opacity: 0.8,
              filter: 'brightness(1.2)'
            }}
          />
        </Box>
      </Box>

      {/* Main Content Area */}
      <MainContent>
        <FormCard>
          <CardContent sx={{ p: 4, minHeight: '600px' }}>
            {/* Form Content */}
            <Box>
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