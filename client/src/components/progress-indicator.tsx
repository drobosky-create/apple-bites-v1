import { FormStep } from "@/hooks/use-valuation-form";
import { ArgonBox, ArgonTypography } from "@/components/ui/argon-authentic";
import { User, Calculator, Settings, TrendingUp, CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { id: "contact", label: "Contact", number: 1, icon: User },
  { id: "ebitda", label: "EBITDA", number: 2, icon: Calculator },
  { id: "adjustments", label: "Adjustments", number: 3, icon: Settings },
  { id: "valueDrivers", label: "Value Drivers", number: 4, icon: TrendingUp },
  { id: "followUp", label: "Follow-up", number: 5, icon: CheckCircle },
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
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    step.number <= currentStepNumber
                      ? "bg-gradient-to-br from-[#0b2147] to-[#1a365d] text-white hover:scale-105"
                      : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                  }`}
                >
                  <IconComponent className={`h-6 w-6 transition-colors ${
                    step.number <= currentStepNumber ? "text-white" : "text-slate-400"
                  }`} />
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
                    <div className="inline-flex items-center mt-1 px-3 py-1 bg-[#0b2147]/10 text-[#0b2147] text-sm font-semibold rounded-full ring-1 ring-[#0b2147]/30 shadow-sm">
                      Current
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block relative">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = step.number <= currentStepNumber;
            const isCurrent = step.number === currentStepNumber;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  {/* Step Circle with Icon */}
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 mb-3 group-hover:scale-105 shadow-xl ${
                      isActive
                        ? "bg-gradient-to-br from-[#0b2147] to-[#1a365d] text-white"
                        : "bg-slate-200 text-slate-400 group-hover:bg-slate-300"
                    }`}
                  >
                    <IconComponent className={`h-7 w-7 transition-colors ${
                      isActive ? "text-white group-hover:text-slate-200" : "text-slate-400"
                    }`} />
                    {/* Step number badge */}
                    <div className={`absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md ring-1 ${
                      isActive ? "ring-[#0b2147]" : "ring-slate-300"
                    }`}>
                      <span className={`text-xs font-bold ${
                        isActive ? "text-[#0b2147]" : "text-slate-600"
                      }`}>{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Step Label */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${
                        isActive ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    
                    {/* Current Step Pill */}
                    {isCurrent && (
                      <div className="mt-1 px-3 py-1 bg-gradient-to-r from-[#0b2147] to-[#1a365d] text-white text-sm font-semibold rounded-full shadow-md border border-white/20 animate-pulse">
                        Current
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-3 min-w-6 relative overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-700 ease-in-out ${
                        step.number < currentStepNumber 
                          ? "bg-gradient-to-r from-[#0b2147] to-[#1a365d] w-full" 
                          : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ArgonBox>
  );
}
