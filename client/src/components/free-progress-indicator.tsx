import { FormStep } from "@/hooks/use-valuation-form";

interface FreeProgressIndicatorProps {
  currentStep: FormStep;
}

const freeSteps = [
  { id: "contact", label: "Contact Information", number: 1 },
  { id: "ebitda", label: "EBITDA Calculation", number: 2 },
  { id: "adjustments", label: "EBITDA Adjustments", number: 3 },
  { id: "valueDrivers", label: "Value Drivers", number: 4 },
  { id: "followUp", label: "Follow-up", number: 5 },
];

export default function FreeProgressIndicator({ currentStep }: FreeProgressIndicatorProps) {
  const currentStepNumber = freeSteps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-0">Basic Business Assessment</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-600">Step {currentStepNumber} of 5</span>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="space-y-3">
          {freeSteps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.number <= currentStepNumber
                    ? "bg-blue-600 text-white shadow-lg"
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
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                    <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {freeSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step.number <= currentStepNumber
                    ? "bg-blue-600 text-white shadow-lg scale-110"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {step.number}
              </div>
              {index < freeSteps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-slate-200 rounded-full">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        step.number < currentStepNumber ? "bg-blue-600 w-full" : "bg-slate-200 w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {freeSteps.map((step) => (
            <div key={step.id} className="text-center" style={{ width: "120px" }}>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}