import { UseFormReturn } from "react-hook-form";
import { ValueDriversData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { ArgonButton } from "@/components/ui/argon-authentic";

interface ValueDriversFormProps {
  form: UseFormReturn<ValueDriversData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: ValueDriversData) => void;
}

type Grade = "A" | "B" | "C" | "D" | "F";

const valueDrivers = [
  {
    name: "financialPerformance",
    title: "Financial Performance",
    description: "Revenue growth, profitability trends, and financial stability",
  },
  {
    name: "customerConcentration",
    title: "Customer Concentration",
    description: "Diversification of customer base and revenue concentration risk",
  },
  {
    name: "managementTeam",
    title: "Management Team Strength",
    description: "Quality and depth of management team, succession planning",
  },
  {
    name: "competitivePosition",
    title: "Competitive Position",
    description: "Market share, competitive advantages, and barriers to entry",
  },
  {
    name: "growthProspects",
    title: "Growth Prospects",
    description: "Market growth potential and expansion opportunities",
  },
  {
    name: "systemsProcesses",
    title: "Systems & Processes",
    description: "Operational systems and documentation",
  },
  {
    name: "assetQuality",
    title: "Asset Quality",
    description: "Condition and value of business assets",
  },
  {
    name: "industryOutlook",
    title: "Industry Outlook",
    description: "Industry trends and future prospects",
  },
  {
    name: "riskFactors",
    title: "Risk Factors",
    description: "Overall business risk assessment",
  },
  {
    name: "ownerDependency",
    title: "Owner Dependency",
    description: "Business dependence on current owner",
  },
];

const grades: Grade[] = ["A", "B", "C", "D", "F"];

interface GradeRadioGroupProps {
  name: string;
  value: Grade;
  onChange: (value: Grade) => void;
  size?: "small" | "large";
}

function GradeRadioGroup({ name, value, onChange, size = "large" }: GradeRadioGroupProps) {
  const sizeClasses = size === "small" ? "w-8 h-8 text-sm" : "w-12 h-12 text-base";
  
  return (
    <div className="flex space-x-3">
      {grades.map((grade) => (
        <label key={grade} className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={grade}
            checked={value === grade}
            onChange={() => onChange(grade)}
            className="sr-only"
          />
          <div
            className={`${sizeClasses} rounded-xl border-2 flex items-center justify-center font-bold transition-all ${
              value === grade
                ? "text-white shadow-lg scale-110 border-[#0b2147]"
              : "border-slate-300 text-slate-700 hover:border-[#0b2147] hover:scale-105"
            }`}
            style={
                value === grade
                  ? { background: 'linear-gradient(135deg, #0d1b2a 0%, #adb5bd 100%)' }
                  : {}
              }
          >
            {grade}
          </div>
        </label>
      ))}
    </div>
  );
}

export default function ValueDriversForm({ form, onNext, onPrev, onDataChange }: ValueDriversFormProps) {
  const onSubmit = (data: ValueDriversData) => {
    onDataChange(data);
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Executive Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
          <Info className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0b2147] mb-2">Value Drivers Assessment</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Rate your business on these key value drivers. Your scores will influence the valuation multiple.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Scoring Guide */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Scoring Guide</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    <strong>A:</strong> Excellent/Industry Leading | <strong>B:</strong> Above Average | <strong>C:</strong> Average | <strong>D:</strong> Below Average | <strong>F:</strong> Poor/Significant Issues
                  </p>
                </div>
              </div>
            </div>

            {/* Value Drivers Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Business Value Drivers</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {valueDrivers.map((driver) => (
                  <FormField
                    key={driver.name}
                    control={form.control}
                    name={driver.name as keyof ValueDriversData}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div>
                          <FormLabel className="text-base font-semibold text-[#0b2147] mb-2 block">
                            {driver.title}
                          </FormLabel>
                          <p className="text-sm text-slate-600 mb-4">
                            {driver.description}
                          </p>
                        </div>
                        <FormControl>
                          <GradeRadioGroup
                            name={driver.name}
                            value={field.value as Grade}
                            onChange={(value) => {
                              field.onChange(value);
                              onDataChange(form.getValues());
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:justify-between pt-8 mt-8 border-t border-slate-200">
              <button 
                type="button" 
                onClick={onPrev}
                className="order-2 sm:order-1 px-8 py-3 text-base font-medium rounded-xl border-2 border-[#0b2147] text-[#0b2147] bg-white hover:bg-[#0b2147] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Previous
              </button>
              <button 
                type="submit" 
                className="order-1 sm:order-2 px-8 py-3 text-base font-medium rounded-xl bg-gradient-to-r from-[#0b2147] to-[#1a365d] text-white hover:from-[#1a365d] hover:to-[#0b2147] transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                Next: Follow-up
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}