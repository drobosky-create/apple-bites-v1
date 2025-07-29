import { useValuationForm } from "@/hooks/use-valuation-form";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingPopup from "@/components/LoadingPopup";
import AssessmentStepper from "@/components/AssessmentStepper";
import { 
  Home, 
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
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  
  // Use the existing valuation form hook (same as free assessment)
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    submitAssessment,
    results,
    isSubmitting,
    isGeneratingReport,
    forms
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
        return (
          <EbitdaForm
            form={forms.ebitda}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("ebitda", data)}
            calculateEbitda={() => {
              const { netIncome, interest, taxes, depreciation, amortization } = formData.ebitda;
              return (
                parseFloat(netIncome || "0") +
                parseFloat(interest || "0") +
                parseFloat(taxes || "0") +
                parseFloat(depreciation || "0") +
                parseFloat(amortization || "0")
              );
            }}
          />
        );
      case 'adjustments':
        return (
          <AdjustmentsForm
            form={forms.adjustments}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("adjustments", data)}
            calculateAdjustedEbitda={() => {
              const baseEbitda = parseFloat(formData.ebitda.netIncome || "0") +
                parseFloat(formData.ebitda.interest || "0") +
                parseFloat(formData.ebitda.taxes || "0") +
                parseFloat(formData.ebitda.depreciation || "0") +
                parseFloat(formData.ebitda.amortization || "0");
              const { ownerSalary, personalExpenses, oneTimeExpenses, otherAdjustments } = formData.adjustments;
              return baseEbitda +
                parseFloat(ownerSalary || "0") +
                parseFloat(personalExpenses || "0") +
                parseFloat(oneTimeExpenses || "0") +
                parseFloat(otherAdjustments || "0");
            }}
            baseEbitda={parseFloat(formData.ebitda.netIncome || "0") +
              parseFloat(formData.ebitda.interest || "0") +
              parseFloat(formData.ebitda.taxes || "0") +
              parseFloat(formData.ebitda.depreciation || "0") +
              parseFloat(formData.ebitda.amortization || "0")}
          />
        );
      case 'valueDrivers':
        return (
          <ValueDriversForm
            form={forms.valueDrivers}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("valueDrivers", data)}
          />
        );
      case 'followUp':
        return (
          <FollowUpForm
            form={forms.followUp}
            onSubmit={() => {
              // Submit assessment with paid tier flag
              submitAssessment();
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("followUp", data)}
            isSubmitting={isSubmitting}
          />
        );
      case 'results':
        return <ValuationResults results={results} />;
      default:
        return (
          <EbitdaForm
            form={forms.ebitda}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateFormData("ebitda", data)}
            calculateEbitda={() => 0}
          />
        );
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