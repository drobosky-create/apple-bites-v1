import { FormStep } from "@/hooks/use-valuation-form";

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { id: "contact", label: "Contact Information", number: 1 },
  { id: "ebitda", label: "EBITDA", number: 2 },
  { id: "adjustments", label: "Adjustments", number: 3 },
  { id: "valueDrivers", label: "Value Drivers", number: 4 },
  { id: "followUp", label: "Follow-up", number: 5 },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepNumber = steps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Business Valuation Assessment</h2>
          <span className="text-sm text-slate-500">Step {currentStepNumber} of 5</span>
        </div>

        <div className="relative">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number <= currentStepNumber
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      step.number < currentStepNumber ? "bg-primary" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
