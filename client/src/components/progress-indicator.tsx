import { FormStep } from "@/hooks/use-valuation-form";

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { id: "contact", label: "Contact Information", number: 1 },
  { id: "ebitda", label: "EBITDA & Adjustments", number: 2 },
  { id: "valueDrivers", label: "Value Drivers", number: 3 },
  { id: "followUp", label: "Follow-up", number: 4 },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepNumber = steps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Business Valuation Assessment
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-slate-600">Step {currentStepNumber} of 4</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.number <= currentStepNumber
                      ? "heritage-gradient text-white shadow-lg scale-110"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-4">
                  <span
                    className={`block text-sm font-semibold transition-colors duration-300 ${
                      step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.number === currentStepNumber && (
                    <span className="block text-xs text-blue-600 font-medium mt-0.5">Current</span>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-6 relative">
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        step.number < currentStepNumber 
                          ? "heritage-gradient w-full" 
                          : "w-0"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
