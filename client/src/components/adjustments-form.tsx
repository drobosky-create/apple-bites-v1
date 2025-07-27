import { UseFormReturn } from "react-hook-form";
import { AdjustmentsData } from "@shared/schema";




import { 
  MaterialCard, 
  MaterialCardBody, 
  MaterialButton 
} from "@/components/ui/material-dashboard-system";
import { Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";

interface AdjustmentsFormProps {
  form: UseFormReturn<AdjustmentsData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: AdjustmentsData) => void;
  calculateAdjustedEbitda: () => number;
  baseEbitda: number;
}

export default function AdjustmentsForm({ 
  form, 
  onNext, 
  onPrev, 
  onDataChange, 
  calculateAdjustedEbitda,
  baseEbitda 
}: AdjustmentsFormProps) {
  const watchedValues = form.watch();
  const adjustedEbitda = calculateAdjustedEbitda();
  
  const totalAdjustments = 
    parseFloat(watchedValues.ownerSalary || "0") +
    parseFloat(watchedValues.personalExpenses || "0") +
    parseFloat(watchedValues.oneTimeExpenses || "0") +
    parseFloat(watchedValues.otherAdjustments || "0");

  const onSubmit = (data: AdjustmentsData) => {
    onDataChange(data);
    onNext();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Executive Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0b2147] mb-2">EBITDA Adjustments</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Add back expenses that don't represent the true earning potential of your business.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Adjustments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Adjustment Categories</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="ownerSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excess Owner Compensation</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400 bg-[#f8fafc]">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="form-help">Amount paid to owner above market rate for the position</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Expenses</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400 bg-[#f8fafc]">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="form-help">Personal expenses run through the business</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oneTimeExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Expenses</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400 bg-[#f8fafc]">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="form-help">Non-recurring expenses (legal fees, consulting, etc.)</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherAdjustments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Adjustments</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400 bg-[#f8fafc]">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="form-help">Any other legitimate business adjustments</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="adjustmentNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjustment Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                    className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Describe any adjustments in detail..."
                    onChange={(e) => {
                      field.onChange(e);
                      onDataChange(form.getValues());
                    }}
                  />
                </FormControl>
                <p className="form-help">Provide context for your adjustments to help with valuation accuracy</p>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Adjusted EBITDA Calculation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Base EBITDA</span>
                <span className="font-medium">{formatCurrency(baseEbitda)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Owner Adjustments</span>
                <span className="font-medium">{formatCurrency(totalAdjustments)}</span>
              </div>
              <hr className="border-slate-300" />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-slate-900">Adjusted EBITDA</span>
                <span className="text-green-600">{formatCurrency(adjustedEbitda)}</span>
              </div>
            </div>
          </div>

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
                Next: Value Drivers
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
