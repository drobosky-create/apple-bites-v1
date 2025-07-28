import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Box,
  styled,
} from '@mui/material';

// Custom connector styled for Apple Bites
const AppleBitesConnector = styled(StepConnector)(({ theme }) => ({
  alternativeLabel: {
    top: 22,
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
}));

// Custom Step Icon with Apple Bites styling
const StepIconRoot = styled('div')<{ ownerState: { active: boolean; completed: boolean } }>(({ theme, ownerState }) => ({
  backgroundColor:
    ownerState.active || ownerState.completed ? '#00BFA6' : '#fff',
  zIndex: 1,
  color: ownerState.active || ownerState.completed ? '#fff' : '#B0B7C3',
  width: 32,
  height: 32,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid',
  borderColor: ownerState.completed ? '#00BFA6' : '#E0E0E0',
  fontSize: '14px',
  fontWeight: 600,
}));

interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  className?: string;
  icon: number;
}

function CustomStepIcon(props: CustomStepIconProps) {
  const { active, completed, className, icon } = props;
  const icons: Record<number, string> = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  };

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : icons[icon]}
    </StepIconRoot>
  );
}

// Labels for each step  
const steps = ['EBITDA', 'Adjustments', 'Value Drivers', 'Report'];

interface AssessmentStepperProps {
  activeStep: number;
}

export default function AssessmentStepper({ activeStep }: AssessmentStepperProps) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<AppleBitesConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: activeStep === index ? 600 : 400,
                  color: activeStep === index ? '#00BFA6' : '#0A1F44',
                  fontSize: '0.875rem',
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}