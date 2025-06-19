import { UseFormReturn } from "react-hook-form";
import { AdjustmentsData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60">
      <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/40 rounded-t-xl">
        <div className="flex items-center gap-3 mb-3 bg-[#f9fbfb]">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Owner Adjustments</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">Add back non-recurring expenses and owner-specific adjustments to normalize EBITDA.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="ownerSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excess Owner Compensation</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
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
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
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
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
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
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
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

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6 mt-8">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev}
              className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg order-2 sm:order-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>
            <Button type="submit" className="heritage-gradient text-white px-6 sm:px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 order-1 sm:order-2">
              Next: Value Drivers
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
