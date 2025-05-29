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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Owner Adjustments</h3>
        <p className="text-slate-600">Add back non-recurring expenses and owner-specific adjustments to normalize EBITDA.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                    className="form-input"
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

          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev}
              className="text-slate-600 px-8 py-3 rounded-lg font-medium hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>
            <Button type="submit" className="btn-primary px-8 py-3 rounded-lg font-medium">
              Next: Value Drivers
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
