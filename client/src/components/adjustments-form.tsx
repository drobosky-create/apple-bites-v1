import { UseFormReturn } from "react-hook-form";
import { AdjustmentsData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
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
    <ArgonBox shadow="xl" borderRadius="xl" bgColor="white" p={8} className="border border-gray-100">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <ArgonTypography variant="h4" fontWeight="bold" color="dark" className="mb-2">
            EBITDA Adjustments
          </ArgonTypography>
          <ArgonTypography variant="body2" color="text" className="text-gray-600">
            Add back expenses that don't represent the true earning potential of your business.
          </ArgonTypography>
        </div>
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
    </ArgonBox>
  );
}
