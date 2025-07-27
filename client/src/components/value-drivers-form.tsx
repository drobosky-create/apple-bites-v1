import { UseFormReturn } from "react-hook-form";
import { ValueDriversData } from "@shared/schema";


import { ArrowLeft, ArrowRight, Info } from "lucide-react";


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
    <div >
      {grades.map((grade) => (
        <label key={grade} >
          <input
            type="radio"
            name={name}
            value={grade}
            checked={value === grade}
            onChange={() => onChange(grade)}
            
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
    <div >
      {/* Executive Header Section */}
      <div >
        <div >
          <Info  />
        </div>
        <div>
          <h1 >Value Drivers Assessment</h1>
          <p >
            Rate your business on these key value drivers. Your scores will influence the valuation multiple.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            {/* Scoring Guide */}
            <div >
              <div >
                <div >
                  <Info  />
                </div>
                <div>
                  <h4 >Scoring Guide</h4>
                  <p >
                    <strong>A:</strong> Excellent/Industry Leading | <strong>B:</strong> Above Average | <strong>C:</strong> Average | <strong>D:</strong> Below Average | <strong>F:</strong> Poor/Significant Issues
                  </p>
                </div>
              </div>
            </div>

            {/* Value Drivers Section */}
            <div >
              <h3 >Business Value Drivers</h3>

              <div >
                {valueDrivers.map((driver) => (
                  <FormField
                    key={driver.name}
                    control={form.control}
                    name={driver.name as keyof ValueDriversData}
                    render={({ field }) => (
                      <FormItem >
                        <div>
                          <FormLabel >
                            {driver.title}
                          </FormLabel>
                          <p >
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
                        <FormMessage  />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div >
              <button 
                type="button" 
                onClick={onPrev}
                
              >
                <ArrowLeft  />
                Previous
              </button>
              <button 
                type="submit" 
                
              >
                Next: Follow-up
                <ArrowRight  />
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}