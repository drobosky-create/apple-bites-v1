import { useState, useEffect } from "react";
import { Card, CardContent, Box, FormControlLabel, RadioGroup, Radio, FormControl, Alert, AlertTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import MDBox from "@/components/MD/MDBox";
import MDButton from "@/components/MD/MDButton";
import MDTypography from "@/components/MD/MDTypography";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingPopup from "@/components/LoadingPopup";
import AssessmentStepper from "@/components/AssessmentStepper";
import { useValuationForm } from "@/hooks/use-valuation-form";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";
import { 
  FileText, 
  Calculator,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Star,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// Material Dashboard Styled Components
const AssessmentBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

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

// Apple Bites Question Types
interface AppleBitesQuestion {
  id: string;
  question: string;
  type: string;
  options: string[];
  weights: number[];
  valueDriver: string;
  scoreRange: number[];
}

// Paid Assessment Steps - Updated for Apple Bites workflow
type PaidAssessmentStep = 'ebitda' | 'adjustments' | 'valueDrivers' | 'followup' | 'results';

// Remove custom stepper - we'll use the same AssessmentStepper as Free Assessment

// Apple Bites Value Drivers Questions Data
const appleBitesQuestions: AppleBitesQuestion[] = [
  {
    id: "driver-financial-performance-1",
    question: "How profitable is your business compared to industry benchmarks?",
    type: "single-choice",
    options: ["Not profitable", "Below average", "Average", "Above average", "Top-tier"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Financial Performance",
    scoreRange: [0, 5]
  },
  {
    id: "driver-financial-performance-2",
    question: "What is your adjusted net profit margin?",
    type: "single-choice",
    options: ["< 5%", "5–10%", "11–15%", "16–20%", "> 20%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Financial Performance",
    scoreRange: [0, 5]
  },
  {
    id: "driver-recurring-revenue-1",
    question: "What percentage of your revenue is recurring (contracts, subscriptions)?",
    type: "single-choice",
    options: ["0%", "1–25%", "26–50%", "51–75%", "76–100%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Recurring Revenue",
    scoreRange: [0, 5]
  },
  {
    id: "driver-recurring-revenue-2",
    question: "How secure are your recurring revenue contracts?",
    type: "single-choice",
    options: ["No contracts", "Month-to-month", "Annual, not auto-renew", "Annual with auto-renew", "Multi-year, auto-renew"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Recurring Revenue",
    scoreRange: [0, 5]
  },
  {
    id: "driver-growth-potential-1",
    question: "How much do you expect your revenue to grow in the next 12 months?",
    type: "single-choice",
    options: ["Decrease", "Flat", "1–10%", "11–30%", "Over 30%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Growth Potential",
    scoreRange: [0, 5]
  },
  {
    id: "driver-growth-potential-2",
    question: "How much do you expect your profit to grow in the next 12 months?",
    type: "single-choice",
    options: ["Decrease", "Flat", "1–10%", "11–30%", "Over 30%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Growth Potential",
    scoreRange: [0, 5]
  },
  {
    id: "driver-owner-dependency-1",
    question: "How long could your business operate successfully without you?",
    type: "single-choice",
    options: ["< 1 week", "1 week – 1 month", "1–3 months", "3–12 months", "Indefinitely"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Owner Dependency",
    scoreRange: [0, 5]
  },
  {
    id: "driver-owner-dependency-2",
    question: "How often do customers request to work directly with the owner?",
    type: "single-choice",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Owner Dependency",
    scoreRange: [0, 5]
  },
  {
    id: "driver-revenue-diversity-1",
    question: "What % of your revenue comes from your single largest customer?",
    type: "single-choice",
    options: [">50%", "26–50%", "11–25%", "6–10%", "<5%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Revenue Diversity",
    scoreRange: [0, 5]
  },
  {
    id: "driver-revenue-diversity-2",
    question: "How many different customer segments do you serve?",
    type: "single-choice",
    options: ["1", "2", "3", "4", "5 or more"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Revenue Diversity",
    scoreRange: [0, 5]
  },
  {
    id: "driver-customer-satisfaction-1",
    question: "What percentage of your customers are 'very satisfied'?",
    type: "single-choice",
    options: ["<25%", "25–50%", "51–75%", "76–90%", ">90%"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Customer Satisfaction",
    scoreRange: [0, 5]
  },
  {
    id: "driver-customer-satisfaction-2",
    question: "How often do customers refer others to your company?",
    type: "single-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Customer Satisfaction",
    scoreRange: [0, 5]
  },
  {
    id: "driver-operational-independence-1",
    question: "How standardized are your internal processes and SOPs?",
    type: "single-choice",
    options: ["None exist", "Some documentation", "Basic SOPs exist", "Well-documented", "Automated and trained"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Operational Independence",
    scoreRange: [0, 5]
  },
  {
    id: "driver-operational-independence-2",
    question: "How easily can you delegate critical business functions?",
    type: "single-choice",
    options: ["Impossible", "Very difficult", "Somewhat difficult", "Fairly easy", "Very easy"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Operational Independence",
    scoreRange: [0, 5]
  },
  {
    id: "driver-scalability-1",
    question: "If demand grew 5x, how easily could your company fulfill it?",
    type: "single-choice",
    options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Scalability",
    scoreRange: [0, 5]
  },
  {
    id: "driver-scalability-2",
    question: "How easily could your business be replicated in another market?",
    type: "single-choice",
    options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Scalability",
    scoreRange: [0, 5]
  },
  {
    id: "driver-team-talent-1",
    question: "How strong is your current leadership team?",
    type: "single-choice",
    options: ["None", "1 manager", "A few informal leaders", "Defined department heads", "Full team with long-term incentives"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Team & Talent",
    scoreRange: [0, 5]
  },
  {
    id: "driver-team-talent-2",
    question: "How difficult would it be to replace your top-performing team member?",
    type: "single-choice",
    options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Team & Talent",
    scoreRange: [0, 5]
  },
  {
    id: "driver-differentiation-1",
    question: "How unique is your product/service compared to competitors?",
    type: "single-choice",
    options: ["Commodity", "Slightly differentiated", "Moderately unique", "Very unique", "One-of-a-kind"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Differentiation & Brand Strength",
    scoreRange: [0, 5]
  },
  {
    id: "driver-differentiation-2",
    question: "How well recognized is your brand in the market?",
    type: "single-choice",
    options: ["Not at all", "Somewhat", "Recognized locally", "Known regionally", "Category leader"],
    weights: [0, 1, 2, 3, 5],
    valueDriver: "Differentiation & Brand Strength",
    scoreRange: [0, 5]
  }
];

export default function GrowthExitAssessment() {
  const [currentStep, setCurrentStep] = useState<PaidAssessmentStep>('ebitda');
  const [valueDriverAnswers, setValueDriverAnswers] = useState<{[key: string]: number}>({});
  const [dataPrePopulated, setDataPrePopulated] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  // Fetch previous assessments to check for existing financial data
  const { data: previousAssessments, isLoading: assessmentsLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Get valuation form for standard steps
  const {
    formData: valuationFormData,
    updateFormData: updateValuationFormData,
    forms,
    submitAssessment,
    results,
    isSubmitting,
    isGeneratingReport
  } = useValuationForm();

  // Pre-populate financial data from most recent free assessment
  useEffect(() => {
    if (previousAssessments && previousAssessments.length > 0 && !dataPrePopulated) {
      const latestAssessment = previousAssessments[0];
      
      // Check if this assessment has financial data
      if (latestAssessment.netIncome || latestAssessment.adjustedEbitda) {
        // Pre-populate EBITDA form data
        const ebitdaData = {
          netIncome: latestAssessment.netIncome?.toString() || "0",
          interest: latestAssessment.interest?.toString() || "0",
          taxes: latestAssessment.taxes?.toString() || "0",
          depreciation: latestAssessment.depreciation?.toString() || "0",
          amortization: latestAssessment.amortization?.toString() || "0",
          adjustmentNotes: ""
        };
        
        // Pre-populate adjustments form data
        const adjustmentsData = {
          ownerSalary: latestAssessment.ownerSalary?.toString() || "0",
          personalExpenses: latestAssessment.personalExpenses?.toString() || "0",
          oneTimeExpenses: latestAssessment.oneTimeExpenses?.toString() || "0",
          otherAdjustments: latestAssessment.otherAdjustments?.toString() || "0",
          adjustmentNotes: latestAssessment.adjustmentNotes || ""
        };

        updateValuationFormData("ebitda", ebitdaData);
        updateValuationFormData("adjustments", adjustmentsData);
        
        setDataPrePopulated(true);
        setShowUpdateButton(true);
      }
    }
  }, [previousAssessments, dataPrePopulated, updateValuationFormData]);

  const getStepIndex = (step: PaidAssessmentStep): number => {
    const stepMap = { 'ebitda': 0, 'adjustments': 1, 'valueDrivers': 2, 'followup': 3, 'results': 4 };
    return stepMap[step] || 0;
  };

  const nextStep = () => {
    if (currentStep === 'ebitda') setCurrentStep('adjustments');
    else if (currentStep === 'adjustments') setCurrentStep('valueDrivers');
    else if (currentStep === 'valueDrivers') setCurrentStep('followup');
    else if (currentStep === 'followup') setCurrentStep('results');
  };

  const prevStep = () => {
    if (currentStep === 'adjustments') setCurrentStep('ebitda');
    else if (currentStep === 'valueDrivers') setCurrentStep('adjustments');
    else if (currentStep === 'followup') setCurrentStep('valueDrivers');
    else if (currentStep === 'results') setCurrentStep('followup');
  };

  const handleValueDriverAnswer = (questionId: string, answerIndex: number) => {
    const question = appleBitesQuestions.find(q => q.id === questionId);
    if (question) {
      const score = question.weights[answerIndex];
      setValueDriverAnswers(prev => ({
        ...prev,
        [questionId]: score
      }));
    }
  };

  const clearFinancialData = () => {
    // Clear EBITDA data
    updateValuationFormData("ebitda", {
      netIncome: "",
      interest: "",
      taxes: "",
      depreciation: "",
      amortization: "",
      adjustmentNotes: ""
    });
    
    // Clear adjustments data
    updateValuationFormData("adjustments", {
      ownerSalary: "",
      personalExpenses: "",
      oneTimeExpenses: "",
      otherAdjustments: "",
      adjustmentNotes: ""
    });
    
    setDataPrePopulated(false);
    setShowUpdateButton(false);
  };

  const renderValueDriversForm = () => {
    // Group questions by value driver
    const questionsByDriver = appleBitesQuestions.reduce((acc, question) => {
      if (!acc[question.valueDriver]) {
        acc[question.valueDriver] = [];
      }
      acc[question.valueDriver].push(question);
      return acc;
    }, {} as {[key: string]: AppleBitesQuestion[]});

    return (
      <MDBox>
        {/* Header */}
        <MDBox display="flex" alignItems="center" mb={3}>
          <MDBox
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <Star size={24} color="white" />
          </MDBox>
          <MDBox>
            <MDTypography variant="h5" fontWeight="medium" sx={{ color: '#344767', mb: 0.5 }}>
              Value Drivers Assessment
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e' }}>
              Rate each factor that impacts your business value from A (excellent) to F (poor).
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Value Driver Questions */}
        <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(questionsByDriver).map(([driverName, questions]) => (
            <Card key={driverName} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', mb: 2 }}>
                  {driverName}
                </MDTypography>
                
                {questions.map((question) => (
                  <MDBox key={question.id} sx={{ mb: 3 }}>
                    <MDTypography variant="body1" sx={{ color: '#344767', mb: 2, fontWeight: 'medium' }}>
                      {question.question}
                    </MDTypography>
                    
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={valueDriverAnswers[question.id] || ''}
                        onChange={(e) => handleValueDriverAnswer(question.id, parseInt(e.target.value))}
                        row
                      >
                        {question.options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={index}
                            control={<Radio sx={{ color: '#005b8c' }} />}
                            label={option}
                            sx={{
                              mr: 2,
                              '& .MuiTypography-root': {
                                fontSize: '14px',
                                color: '#67748e'
                              }
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </MDBox>
                ))}
              </CardContent>
            </Card>
          ))}
        </MDBox>

        {/* Navigation */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <MDButton
            variant="outlined"
            sx={{
              color: '#67748e',
              borderColor: '#dee2e6',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#adb5bd'
              }
            }}
            onClick={prevStep}
          >
            Previous
          </MDButton>

          <MDButton
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              color: 'white',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #005b8c 0%, #004a73 100%)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
            disabled={Object.keys(valueDriverAnswers).length < appleBitesQuestions.length}
            onClick={nextStep}
          >
            Continue
          </MDButton>
        </MDBox>
      </MDBox>
    );
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 'ebitda':
        return (
          <MDBox>
            {/* Show loading while fetching previous data */}
            {assessmentsLoading && (
              <MDBox sx={{ textAlign: 'center', py: 2, mb: 3 }}>
                <MDTypography variant="body2" sx={{ color: '#67748e' }}>
                  Checking for previous financial data...
                </MDTypography>
              </MDBox>
            )}
            
            <EbitdaForm
              form={forms.ebitda}
              onNext={nextStep}
              onPrev={() => window.history.back()}
              onDataChange={(data) => updateValuationFormData("ebitda", data)}
              calculateEbitda={() => {
                const { netIncome, interest, taxes, depreciation, amortization } = valuationFormData.ebitda;
                return (
                  parseFloat(netIncome || "0") +
                  parseFloat(interest || "0") +
                  parseFloat(taxes || "0") +
                  parseFloat(depreciation || "0") +
                  parseFloat(amortization || "0")
                );
              }}
            />
          </MDBox>
        );
      case 'adjustments':
        return (
          <AdjustmentsForm
            form={forms.adjustments}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateValuationFormData("adjustments", data)}
            calculateAdjustedEbitda={() => {
              const baseEbitda = parseFloat(valuationFormData.ebitda.netIncome || "0") +
                parseFloat(valuationFormData.ebitda.interest || "0") +
                parseFloat(valuationFormData.ebitda.taxes || "0") +
                parseFloat(valuationFormData.ebitda.depreciation || "0") +
                parseFloat(valuationFormData.ebitda.amortization || "0");
              const { ownerSalary, personalExpenses, oneTimeExpenses, otherAdjustments } = valuationFormData.adjustments;
              return baseEbitda +
                parseFloat(ownerSalary || "0") +
                parseFloat(personalExpenses || "0") +
                parseFloat(oneTimeExpenses || "0") +
                parseFloat(otherAdjustments || "0");
            }}
            baseEbitda={parseFloat(valuationFormData.ebitda.netIncome || "0") +
              parseFloat(valuationFormData.ebitda.interest || "0") +
              parseFloat(valuationFormData.ebitda.taxes || "0") +
              parseFloat(valuationFormData.ebitda.depreciation || "0") +
              parseFloat(valuationFormData.ebitda.amortization || "0")}
          />
        );
      case 'valueDrivers':
        return renderValueDriversForm();
      case 'followup':
        return (
          <FollowUpForm
            form={forms.followUp}
            onNext={() => {
              // Submit assessment with value driver answers
              const combinedData = {
                ...valuationFormData,
                valueDrivers: valueDriverAnswers,
                tier: 'paid'
              };
              submitAssessment();
              setCurrentStep('results');
            }}
            onDataChange={(data) => updateValuationFormData("followUp", data)}
          />
        );
      case 'results':
        return results ? <ValuationResults results={results} /> : <div>Loading...</div>;
      default:
        return null;
    }
  };

  return (
    <AssessmentBackground>
      {isGeneratingReport && <LoadingPopup open={isGeneratingReport} />}
      
      <MainContent>
        {/* Header */}
        <MDBox sx={{ textAlign: 'center', mb: 4 }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#333333' }}>
              Growth & Exit Assessment
            </MDTypography>
            <MDBox
              sx={{
                backgroundColor: '#4682B4',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              $795 PREMIUM TIER
            </MDBox>
          </MDBox>
          
          <MDTypography variant="body1" sx={{ color: '#666666' }}>
            Industry-specific strategic valuation with AI insights
          </MDTypography>
        </MDBox>

        {/* Data Pre-population Alert */}
        {showUpdateButton && (
          <MDBox sx={{ mb: 3, mx: 'auto', maxWidth: '95%' }}>
            <Alert 
              severity="success" 
              sx={{ 
                backgroundColor: '#f0f9f4',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#22c55e'
                }
              }}
              action={
                <MDButton
                  size="small"
                  sx={{
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontSize: '12px',
                    px: 2,
                    py: 0.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    '&:hover': {
                      backgroundColor: '#16a34a',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={clearFinancialData}
                  startIcon={<RefreshCw size={14} />}
                >
                  Update Info
                </MDButton>
              }
            >
              <AlertTitle sx={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>
                Financial Data Loaded
              </AlertTitle>
              <MDTypography variant="body2" sx={{ color: '#166534', fontSize: '13px' }}>
                We've pre-filled your financial information from your previous assessment. Click "Update Info" to modify.
              </MDTypography>
            </Alert>
          </MDBox>
        )}

        {/* Progress Stepper - Same as Free Assessment */}
        <AssessmentStepper activeStep={getStepIndex(currentStep)} />

        {/* Form Card */}
        <FormCard>
          <CardContent sx={{ p: 4 }}>
            {renderStepComponent()}
          </CardContent>
        </FormCard>
      </MainContent>
    </AssessmentBackground>
  );
}