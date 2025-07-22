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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Chip
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
  background: `
    linear-gradient(135deg, 
      #0b2147 0%, 
      #1e3a8a 25%, 
      #312e81 50%, 
      #1e293b 75%, 
      #0f172a 100%
    ),
    radial-gradient(ellipse at 70% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)
  `,
  backgroundAttachment: 'fixed',
  position: 'relative',
  gap: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 90C77.614 90 100 67.614 100 40S77.614 0 50 0 0 22.386 0 50s22.386 40 50 40zm0-8c19.882 0 36-16.118 36-36S69.882 8 50 8 14 24.118 14 50s16.118 32 36 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
      linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.01) 50%, transparent 60%)
    `,
    pointerEvents: 'none',
    opacity: 0.4,
  }
}));

const drawerWidth = 280;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '24px 24px 24px 8px',
  marginLeft: 0,
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
  position: 'relative',
  background: 'transparent',
}));

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: `
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
  }
}));

const StepIcon = styled(Box)<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: completed ? '#4caf50' : active ? '#2152ff' : '#e3e6ea',
  color: completed || active ? 'white' : '#67748e',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  border: active ? '3px solid rgba(33, 82, 255, 0.3)' : 'none',
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

  const steps = [
    { id: 'contact', label: 'Contact Info', icon: User, description: 'Basic information' },
    { id: 'ebitda', label: 'Financial Data', icon: DollarSign, description: 'Revenue & EBITDA' },
    { id: 'adjustments', label: 'Adjustments', icon: Calculator, description: 'Owner benefits' },
    { id: 'valueDrivers', label: 'Value Drivers', icon: BarChart3, description: 'Business scoring' },
    { id: 'followUp', label: 'Follow-up', icon: MessageCircle, description: 'Final details' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <AssessmentBackground>
      {/* Material Dashboard Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, rgba(11, 33, 71, 0.95) 0%, rgba(26, 54, 93, 0.98) 50%, rgba(11, 33, 71, 0.95) 100%)',
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, transparent 100%),
                radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 70%)
              `,
              pointerEvents: 'none',
            }
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
          {/* Logo Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <SidebarCard sx={{ p: 2, mb: 2 }}>
              <img
                src={appleBitesLogo}
                alt="Apple Bites"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '60px',
                  objectFit: 'contain' 
                }}
              />
            </SidebarCard>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600
              }}
            >
              Business Valuation Assessment
            </Typography>
          </Box>

          {/* Progress Steps */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              const StepIconComponent = step.icon;
              
              return (
                <Box key={step.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <StepIcon active={isActive} completed={isCompleted}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <StepIconComponent size={20} />
                      )}
                    </StepIcon>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '16px'
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px'
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
                          backgroundColor: '#ffffff',
                          color: '#2152ff',
                          fontSize: '10px',
                          height: '20px'
                        }} 
                      />
                    )}
                  </Box>
                  {index < steps.length - 1 && (
                    <StepConnector />
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Navigation Actions */}
          <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Box
              component="button"
              onClick={() => window.location.href = '/dashboard'}
              sx={{
                width: '100%',
                p: 2,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                textTransform: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 1,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.4)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Home size={18} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Dashboard
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                display: 'block',
                textAlign: 'center',
                mt: 2
              }}
            >
              © 2025 Meritage Partners
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <MainContent>
        <FormCard>
          <CardContent sx={{ p: 4, minHeight: '600px' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" color="#344767" gutterBottom>
                {steps.find(step => step.id === currentStep)?.label}
              </Typography>
              <Typography variant="body1" color="#67748e">
                {steps.find(step => step.id === currentStep)?.description}
              </Typography>
            </Box>

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