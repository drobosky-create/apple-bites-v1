import { FormStep } from "@/hooks/use-valuation-form";
import { ArgonBox, ArgonTypography } from "@/components/ui/argon-authentic";

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { id: "contact", label: "Contact Information", number: 1 },
  { id: "ebitda", label: "EBITDA Calculation", number: 2 },
  { id: "adjustments", label: "EBITDA Adjustments", number: 3 },
  { id: "valueDrivers", label: "Value Drivers", number: 4 },
  { id: "followUp", label: "Follow-up", number: 5 },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepNumber = steps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <ArgonBox shadow="sm" borderRadius="lg" bgColor="white" p={3}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <ArgonTypography variant="h5" fontWeight="bold" color="dark" className="mb-2 sm:mb-0">Apple Bites Business Assessment</ArgonTypography>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#0b2147] rounded-full animate-pulse"></div>
          <ArgonTypography variant="caption" color="text">Step {currentStepNumber} of 5</ArgonTypography>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.number <= currentStepNumber
                    ? "bg-[#0b2147] text-white shadow-lg"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {step.number}
              </div>
              <div className="ml-3 flex-1">
                <span
                  className={`block text-sm font-medium transition-colors duration-300 ${
                    step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                {step.number === currentStepNumber && (
                  <span className="block text-xs text-[#0b2147] font-medium">Current</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block relative">
        <div className="overflow-x-auto px-2">
          <div className="flex items-center justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step.number <= currentStepNumber
                        ? "bg-[#0b2147] text-white shadow-lg scale-110"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-3">
                    <span
                      className={`block text-sm font-semibold transition-colors duration-300 ${
                        step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.number === currentStepNumber && (
                      <span className="block text-xs text-[#0b2147] font-medium mt-0.5">Current</span>
                    )}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="w-10 h-1 bg-slate-200 mx-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        step.number < currentStepNumber ? "bg-[#0b2147] w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ArgonBox>
  );
}
