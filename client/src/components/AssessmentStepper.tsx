import React from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled 
} from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import { 
  User, 
  DollarSign, 
  Calculator, 
  BarChart3, 
  FileText,
  CheckCircle 
} from 'lucide-react';

interface AssessmentStepperProps {
  currentStep: string;
}

// Custom styled connector
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#C41261',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#C41261',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom step icon root
const CustomStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed || ownerState.active ? '#C41261' : '#eaeaf0',
  zIndex: 1,
  color: ownerState.completed || ownerState.active ? '#fff' : '#999',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  boxShadow: ownerState.completed || ownerState.active 
    ? '0 4px 10px 0 rgba(196, 18, 97, 0.3)'
    : 'none',
  ...(ownerState.active && {
    boxShadow: '0 4px 10px 0 rgba(196, 18, 97, 0.3), 0 0 0 1px rgba(196, 18, 97, 0.5)',
  }),
}));

function CustomStepIcon(props: any) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <User size={24} />,
    2: <DollarSign size={24} />,
    3: <Calculator size={24} />,
    4: <BarChart3 size={24} />,
    5: <FileText size={24} />,
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckCircle size={24} /> : icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

const steps = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'ebitda', label: 'EBITDA', icon: DollarSign },
  { id: 'adjustments', label: 'Adjustments', icon: Calculator },
  { id: 'valueDrivers', label: 'Value Drivers', icon: BarChart3 },
  { id: 'followUp', label: 'Report', icon: FileText },
];

export default function AssessmentStepper({ currentStep }: AssessmentStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <MDBox mb={4}>
      <Stepper 
        alternativeLabel 
        activeStep={currentStepIndex} 
        connector={<CustomStepConnector />}
        sx={{
          '& .MuiStepLabel-root': {
            padding: '0 8px',
          },
          '& .MuiStepLabel-label': {
            fontSize: '14px',
            fontWeight: 500,
            marginTop: '8px',
            '&.Mui-active': {
              color: '#C41261',
              fontWeight: 600,
            },
            '&.Mui-completed': {
              color: '#C41261',
              fontWeight: 600,
            },
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </MDBox>
  );
}