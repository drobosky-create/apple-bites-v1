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
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px 24px 24px 8px',
  marginLeft: 0,
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
  backgroundColor: '#f8f9fa',
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
            backgroundImage: 'url(/assets/twilight-city-skyline.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            border: 'none',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(11, 20, 38, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 1,
              pointerEvents: 'none',
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Logo and User Info */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Box component="img"
              src="/assets/logos/apple-bites-logo-variant-3.png"
              alt="Apple Bites Business Assessment"
              sx={{
                width: '80%',
                maxWidth: 200,
                mt: 1,
                mb: 1,
                mx: 'auto',
                display: 'block',
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
              Demo User
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
              demo@example.com
            </Typography>
            <Chip 
              label="Free Assessment"
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          <List sx={{ px: 2, py: 2 }}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => window.location.href = '/dashboard'}
                sx={{ 
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <Home size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: '12px',
                  mb: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <FileText size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary="New Assessment" 
                  primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                sx={{ 
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <TrendingUp size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary="Upgrade Plan" 
                  primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* Progress Steps */}
          <Box sx={{ px: 2, py: 1, flex: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                px: 2,
                mb: 2,
                display: 'block'
              }}
            >
              Assessment Progress
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;
                const StepIconComponent = step.icon;
                
                return (
                  <Box key={step.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                      <StepIcon active={isActive} completed={isCompleted}>
                        {isCompleted ? (
                          <CheckCircle size={18} />
                        ) : (
                          <StepIconComponent size={18} />
                        )}
                      </StepIcon>
                      <Box sx={{ flex: 1 }}>
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
                          size="large" 
                          sx={{ 
                            backgroundColor: '#ffffff',
                            color: '#2152ff',
                            fontSize: '8px',
                            height: '16px'
                          }} 
                        />
                      )}
                    </Box>
                    {index < steps.length - 1 && (
                      <Box sx={{ 
                        ml: 2.75, 
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
          <Box sx={{ mt: 'auto', p: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                display: 'block',
                textAlign: 'center'
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