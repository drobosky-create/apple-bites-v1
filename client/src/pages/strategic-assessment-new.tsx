import { useValuationForm } from "@/hooks/use-valuation-form";
import { useEffect } from "react";
import ProgressIndicator from "@/components/progress-indicator";
import ContactForm from "@/components/contact-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingPopup from "@/components/LoadingPopup";
import AssessmentStepper from "@/components/AssessmentStepper";
import IndustryForm from "@/components/industry-form";
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
  DollarSign,
  Building2
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

export default function GrowthExitAssessment() {
  const [location] = useLocation();
  
  // Use the existing valuation form hook (same as free assessment)
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    submitAssessment,
    resetForm,
    contactForm,
    ebitdaForm,
    adjustmentsForm,
    valueDriversForm,
    followUpForm,
    submitMutation,
    results,
    isGeneratingReport
  } = useValuationForm();

  // Define steps for paid assessment (without contact step, starts with ebitda)
  const steps = [
    { 
      id: 'ebitda', 
      title: 'Financials', 
      component: 'ebitda',
      icon: DollarSign 
    },
    { 
      id: 'adjustments', 
      title: 'Adjustments', 
      component: 'adjustments',
      icon: Calculator 
    },
    { 
      id: 'valueDrivers', 
      title: 'Value Drivers', 
      component: 'value-drivers',
      icon: TrendingUp 
    },
    { 
      id: 'followUp', 
      title: 'Follow-up', 
      component: 'followup',
      icon: MessageCircle 
    },
    { 
      id: 'results', 
      title: 'Complete', 
      component: 'results',
      icon: CheckCircle 
    }
  ];

  const renderStepComponent = () => {
    switch (currentStep) {
      case 'ebitda':
        return <EbitdaForm />;
      case 'adjustments':
        return <AdjustmentsForm />;
      case 'valueDrivers':
        return <ValueDriversForm />;
      case 'followUp':
        return <FollowUpForm />;
      case 'results':
        return <ValuationResults isPaid={true} />;
      default:
        return <EbitdaForm />;
    }
  };

  return (
    <AssessmentBackground>
      {/* Loading Popup */}
      {isGeneratingReport && <LoadingPopup />}
      
      {/* Left Sidebar */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: 'fixed',
          height: 'calc(100vh - 48px)',
          top: 0,
          left: 0,
          zIndex: 1200,
          background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
          overflow: 'hidden',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Header Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                width: 40,
                height: 40,  
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              GE
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                Growth & Exit
              </Typography>
              <Typography variant="body2" sx={{ color: '#dbdce1', fontSize: '12px' }}>
                Strategic Assessment
              </Typography>
            </Box>
          </Box>
          
          <Box
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              borderRadius: '20px',
              px: 2,
              py: 1,
              display: 'inline-block'
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '11px' }}>
              PAID ASSESSMENT
            </Typography>
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box display="flex" flexDirection="column" gap={2} sx={{ p: 3, flex: 1 }}>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            sx={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#dbdce1',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5,
              justifyContent: 'flex-start'
            }}
            startIcon={<Home size={18} />}
          >
            Dashboard
          </Button>

          <Button
            onClick={() => window.location.href = '/value-calculator'}
            sx={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#dbdce1',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5,
              justifyContent: 'flex-start'
            }}
            startIcon={<BarChart3 size={18} />}
          >
            Value Calculator
          </Button>

          <Button
            onClick={() => window.location.href = '/past-assessments'}
            sx={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#dbdce1',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5,
              justifyContent: 'flex-start'
            }}
            startIcon={<FileText size={18} />}
          >
            Past Assessments
          </Button>
        </Box>

        {/* Apple Bites Branding Footer */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#005b8c', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
              MERITAGE
            </Typography>
            <Typography variant="h6" sx={{ color: '#005b8c', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
              PARTNERS
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <MainContent sx={{ marginLeft: `${drawerWidth}px` }}>
        {/* Assessment Stepper - using same component as free assessment */}
        <AssessmentStepper
          steps={steps}
          currentStep={steps.findIndex(s => s.id === currentStep)}
          sx={{ mb: 3 }}
        />

        {/* Form Content */}
        <FormCard>
          <CardContent sx={{ p: 4 }}>
            {renderStepComponent()}
          </CardContent>
        </FormCard>
      </MainContent>
    </AssessmentBackground>
  );
}