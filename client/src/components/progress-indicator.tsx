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
    <div className="space-y-3">
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        const isActive = step.number <= currentStepNumber;
        const isCurrent = step.number === currentStepNumber;
        const isCompleted = step.number < currentStepNumber;
        
        return (
          <div key={step.id} className="relative">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-8 transition-colors duration-300 ${
                  isCompleted ? "bg-white/50" : "bg-white/20"
                }`}
              />
            )}
            
            {/* Step Item */}
            <div className="flex items-center relative">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg relative z-10 ${
                  isCurrent
                    ? "bg-white text-[#0b2147] shadow-white/20 border-2 border-white/50"
                    : isCompleted
                    ? "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    : "bg-white/10 text-white/50 backdrop-blur-sm"
                }`}
              >
                <IconComponent className={`h-5 w-5 transition-colors ${
                  isCurrent ? "text-[#0b2147]" : isCompleted ? "text-white" : "text-white/50"
                }`} />
              </div>
              
              <div className="ml-4 flex-1">
                <span
                  className={`block text-sm font-medium transition-colors duration-300 ${
                    isCurrent ? "text-white font-semibold" : isCompleted ? "text-white/90" : "text-white/50"
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`block text-xs transition-colors duration-300 ${
                    isCurrent ? "text-white/80" : isCompleted ? "text-white/60" : "text-white/40"
                  }`}
                >
                  Step {step.number}
                </span>
                {isCurrent && (
                  <div className="inline-flex items-center mt-1 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm border border-white/30">
                    Current
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
