import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schemas for each step
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(1, "Company name is required"),
  title: z.string().optional(),
});

const industrySchema = z.object({
  businessSector: z.string().min(1, "Please select your business sector"),
  naicsCode: z.string().min(1, "Please select your NAICS industry code"),
  businessDescription: z.string().min(10, "Please provide a detailed business description"),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  marketPosition: z.string().min(1, "Please select your market position"),
  competitiveAdvantages: z.string().optional(),
});

const ebitdaSchema = z.object({
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  costOfGoodsSold: z.string().optional(),
  grossProfit: z.string().optional(),
  operatingExpenses: z.string().min(1, "Operating expenses is required"),
  ebitda: z.string().optional(),
});

const adjustmentsSchema = z.object({
  ownerSalary: z.string().optional(),
  personalExpenses: z.string().optional(),
  oneTimeExpenses: z.string().optional(),
  otherAdjustments: z.string().optional(),
  adjustmentNotes: z.string().optional(),
});

const valueDriversSchema = z.object({
  financialPerformance: z.string().min(1, "Financial performance rating is required"),
  growthPotential: z.string().min(1, "Growth potential rating is required"),
  marketPosition: z.string().min(1, "Market position rating is required"),
  managementTeam: z.string().min(1, "Management team rating is required"),
  customerBase: z.string().min(1, "Customer base rating is required"),
  operationalEfficiency: z.string().min(1, "Operational efficiency rating is required"),
  industryTrends: z.string().min(1, "Industry trends rating is required"),
  competitiveAdvantage: z.string().min(1, "Competitive advantage rating is required"),
});

const followUpSchema = z.object({
  interestedIn: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
  preferredContact: z.string().optional(),
});

export type PaidFormStep = "contact" | "industry" | "ebitda" | "adjustments" | "valueDrivers" | "followUp" | "results";

export interface PaidValuationFormData {
  contact: z.infer<typeof contactSchema>;
  industry: z.infer<typeof industrySchema>;
  ebitda: z.infer<typeof ebitdaSchema>;
  adjustments: z.infer<typeof adjustmentsSchema>;
  valueDrivers: z.infer<typeof valueDriversSchema>;
  followUp: z.infer<typeof followUpSchema>;
}

export function usePaidValuationForm() {
  const [currentStep, setCurrentStep] = useState<PaidFormStep>("contact");
  const [formData, setFormData] = useState<Partial<PaidValuationFormData>>({});

  const forms = {
    contact: useForm({
      resolver: zodResolver(contactSchema),
      defaultValues: formData.contact || {},
    }),
    industry: useForm({
      resolver: zodResolver(industrySchema),
      defaultValues: formData.industry || {},
    }),
    ebitda: useForm({
      resolver: zodResolver(ebitdaSchema),
      defaultValues: formData.ebitda || {},
    }),
    adjustments: useForm({
      resolver: zodResolver(adjustmentsSchema),
      defaultValues: formData.adjustments || {},
    }),
    valueDrivers: useForm({
      resolver: zodResolver(valueDriversSchema),
      defaultValues: formData.valueDrivers || {},
    }),
    followUp: useForm({
      resolver: zodResolver(followUpSchema),
      defaultValues: formData.followUp || {},
    }),
  };

  const steps: PaidFormStep[] = ["contact", "industry", "ebitda", "adjustments", "valueDrivers", "followUp"];

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      setCurrentStep("results");
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const updateFormData = (step: keyof PaidValuationFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const calculateEbitda = (): number => {
    if (!formData.ebitda) return 0;
    
    const revenue = parseFloat(formData.ebitda.annualRevenue || "0");
    const cogs = parseFloat(formData.ebitda.costOfGoodsSold || "0");
    const opex = parseFloat(formData.ebitda.operatingExpenses || "0");
    
    return revenue - cogs - opex;
  };

  const calculateAdjustedEbitda = (): number => {
    const baseEbitda = calculateEbitda();
    if (!formData.adjustments) return baseEbitda;

    const ownerSalary = parseFloat(formData.adjustments.ownerSalary || "0");
    const personalExpenses = parseFloat(formData.adjustments.personalExpenses || "0");
    const oneTimeExpenses = parseFloat(formData.adjustments.oneTimeExpenses || "0");
    const otherAdjustments = parseFloat(formData.adjustments.otherAdjustments || "0");

    return baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;
  };

  const calculateValuation = (): { 
    baseValuation: number; 
    adjustedValuation: number; 
    multiplier: number;
    industryMultiplier: number;
  } => {
    const adjustedEbitda = calculateAdjustedEbitda();
    
    // Get industry-specific multiplier (this would come from NAICS database)
    const industryMultiplier = getIndustryMultiplier(formData.industry?.naicsCode);
    
    // Calculate value driver multiplier adjustments
    const valueDriverMultiplier = calculateValueDriverMultiplier();
    
    // Combined multiplier
    const finalMultiplier = industryMultiplier * valueDriverMultiplier;
    
    return {
      baseValuation: adjustedEbitda * industryMultiplier,
      adjustedValuation: adjustedEbitda * finalMultiplier,
      multiplier: finalMultiplier,
      industryMultiplier: industryMultiplier,
    };
  };

  const getIndustryMultiplier = (naicsCode?: string): number => {
    if (!naicsCode) return 3.5; // Default multiplier
    
    // This would be replaced with actual API call to fetch multiplier ranges
    // For now, using the curated database structure
    const multiplierRanges: { [key: string]: { min: number; avg: number; max: number } } = {
      "111110": { min: 2.0, avg: 2.5, max: 3.0 },
      "111120": { min: 2.0, avg: 2.5, max: 3.0 },
      "211120": { min: 3.5, avg: 4.2, max: 5.0 },
      "212110": { min: 2.5, avg: 3.1, max: 3.8 },
      "236110": { min: 2.0, avg: 2.5, max: 3.0 },
      "237210": { min: 2.0, avg: 2.5, max: 3.0 },
      "311810": { min: 2.7, avg: 3.2, max: 3.8 },
      "423610": { min: 2.3, avg: 2.8, max: 3.3 },
      "441110": { min: 1.8, avg: 2.3, max: 2.8 },
      "541611": { min: 3.2, avg: 3.8, max: 4.5 },
      "611310": { min: 2.0, avg: 2.5, max: 3.0 },
      "722511": { min: 1.7, avg: 2.1, max: 2.5 },
    };
    
    const multiplierRange = multiplierRanges[naicsCode];
    if (!multiplierRange) return 3.5; // Default if not found
    
    // Calculate average score from value drivers
    const averageGrade = calculateAverageGrade();
    
    // Apply grade-based multiplier calculation
    return calculateMultiplierFromGrade(multiplierRange, averageGrade);
  };

  const calculateAverageGrade = (): number => {
    if (!formData.valueDrivers) return 75; // Default to C grade
    
    const grades = [
      formData.valueDrivers.financialPerformance,
      formData.valueDrivers.growthPotential,
      formData.valueDrivers.marketPosition,
      formData.valueDrivers.managementTeam,
      formData.valueDrivers.customerBase,
      formData.valueDrivers.operationalEfficiency,
      formData.valueDrivers.industryTrends,
      formData.valueDrivers.competitiveAdvantage,
    ];
    
    const totalScore = grades.reduce((sum, grade) => {
      const gradeValues: { [key: string]: number } = {
        "A": 95, "B": 85, "C": 75, "D": 65, "F": 50
      };
      return sum + (gradeValues[grade || "C"] || 75);
    }, 0);
    
    return totalScore / grades.length;
  };

  const calculateMultiplierFromGrade = (
    multiplierRange: { min: number; avg: number; max: number },
    gradeScore: number
  ): number => {
    // Map grade score to multiplier range
    if (gradeScore >= 90) {
      // A grades get max multiplier
      return multiplierRange.max;
    } else if (gradeScore >= 80) {
      // B grades get high-end multiplier
      return multiplierRange.avg + (multiplierRange.max - multiplierRange.avg) * 0.7;
    } else if (gradeScore >= 70) {
      // C grades get average multiplier
      return multiplierRange.avg;
    } else if (gradeScore >= 60) {
      // D grades get below average
      return multiplierRange.avg - (multiplierRange.avg - multiplierRange.min) * 0.5;
    } else {
      // F grades get minimum multiplier
      return multiplierRange.min;
    }
  };

  const calculateValueDriverMultiplier = (): number => {
    // Value drivers are now incorporated into the industry multiplier calculation
    // This function returns 1.0 since the grade-based adjustment is handled in getIndustryMultiplier
    return 1.0;
  };

  const resetForm = () => {
    setCurrentStep("contact");
    setFormData({});
    Object.values(forms).forEach(form => form.reset());
  };

  // Mock functions for API compatibility (these would be real API calls)
  const submitAssessment = async (data: any) => {
    // This would submit to the paid assessment API endpoint
    console.log("Submitting paid assessment:", data);
    return { success: true, id: "mock-id" };
  };

  const results = null; // This would come from API
  const isSubmitting = false; // This would track API submission state

  return {
    currentStep,
    setCurrentStep,
    formData,
    forms,
    nextStep,
    prevStep,
    updateFormData,
    calculateEbitda,
    calculateAdjustedEbitda,
    calculateValuation,
    resetForm,
    submitAssessment,
    results,
    isSubmitting,
  };
}