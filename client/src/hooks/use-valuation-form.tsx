import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  ContactInfo,
  EbitdaData,
  AdjustmentsData,
  ValueDriversData,
  FollowUpData,
  contactInfoSchema,
  ebitdaSchema,
  adjustmentsSchema,
  valueDriversSchema,
  followUpSchema,
  type ValuationAssessment,
} from "@shared/schema";

export type FormStep = "contact" | "ebitda" | "adjustments" | "valueDrivers" | "followUp" | "results";

export interface ValuationFormData {
  contact: ContactInfo;
  ebitda: EbitdaData;
  adjustments: AdjustmentsData;
  valueDrivers: ValueDriversData;
  followUp: FollowUpData;
}

const defaultFormData: ValuationFormData = {
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  },
  ebitda: {
    netIncome: "",
    interest: "",
    taxes: "",
    depreciation: "",
    amortization: "",
    adjustmentNotes: "",
  },
  adjustments: {
    ownerSalary: "",
    personalExpenses: "",
    oneTimeExpenses: "",
    otherAdjustments: "",
    adjustmentNotes: "",
  },
  valueDrivers: {
    financialPerformance: "C",
    customerConcentration: "C",
    managementTeam: "C",
    competitivePosition: "C",
    growthProspects: "C",
    systemsProcesses: "C",
    assetQuality: "C",
    industryOutlook: "C",
    riskFactors: "C",
    ownerDependency: "C",
  },
  followUp: {
    followUpIntent: "maybe",
    additionalComments: "",
  },
};

export function useValuationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("contact");
  const [formData, setFormData] = useState<ValuationFormData>(defaultFormData);
  const [results, setResults] = useState<ValuationAssessment | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const contactForm = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: formData.contact,
  });

  const ebitdaForm = useForm<EbitdaData>({
    resolver: zodResolver(ebitdaSchema),
    defaultValues: formData.ebitda,
  });

  const adjustmentsForm = useForm<AdjustmentsData>({
    resolver: zodResolver(adjustmentsSchema),
    defaultValues: formData.adjustments,
  });

  const valueDriversForm = useForm<ValueDriversData>({
    resolver: zodResolver(valueDriversSchema),
    defaultValues: formData.valueDrivers,
  });

  const followUpForm = useForm<FollowUpData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: formData.followUp,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ValuationFormData) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add access token to headers if available
      if (accessToken) {
        headers['x-access-token'] = accessToken;
      }
      
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      return response.json();
    },
    onSuccess: (data: ValuationAssessment) => {
      setResults(data);
      setCurrentStep("results");
    },
  });

  const updateFormData = <K extends keyof ValuationFormData>(
    step: K,
    data: ValuationFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const nextStep = () => {
    const steps: FormStep[] = ["contact", "ebitda", "adjustments", "valueDrivers", "followUp"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      // Scroll to top when advancing to next step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const prevStep = () => {
    const steps: FormStep[] = ["contact", "ebitda", "adjustments", "valueDrivers", "followUp"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      // Scroll to top when going back to previous step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const calculateEbitda = () => {
    const { netIncome, interest, taxes, depreciation, amortization } = formData.ebitda;
    return (
      parseFloat(netIncome || "0") +
      parseFloat(interest || "0") +
      parseFloat(taxes || "0") +
      parseFloat(depreciation || "0") +
      parseFloat(amortization || "0")
    );
  };

  const calculateAdjustedEbitda = () => {
    const baseEbitda = calculateEbitda();
    const { ownerSalary, personalExpenses, oneTimeExpenses, otherAdjustments } = formData.adjustments;
    return (
      baseEbitda +
      parseFloat(ownerSalary || "0") +
      parseFloat(personalExpenses || "0") +
      parseFloat(oneTimeExpenses || "0") +
      parseFloat(otherAdjustments || "0")
    );
  };

  const submitAssessment = () => {
    submitMutation.mutate(formData);
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    calculateEbitda,
    calculateAdjustedEbitda,
    submitAssessment,
    results,
    isSubmitting: submitMutation.isPending,
    forms: {
      contact: contactForm,
      ebitda: ebitdaForm,
      adjustments: adjustmentsForm,
      valueDrivers: valueDriversForm,
      followUp: followUpForm,
    },
  };
}
