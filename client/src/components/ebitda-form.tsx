import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface EbitdaFormProps {
  form: UseFormReturn<EbitdaData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: EbitdaData) => void;
  calculateEbitda: () => number;
}

export default function EbitdaForm({ form, onNext, onPrev, onDataChange, calculateEbitda }: EbitdaFormProps) {
  const watchedValues = form.watch();
  const ebitdaTotal = calculateEbitda();

  const onSubmit = (data: EbitdaData) => {
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
        <h3 className="text-xl font-semibold text-slate-900 mb-2">EBITDA & Adjustments</h3>
        <p className="text-slate-600">Please provide your company's financial information for the most recent fiscal year and any adjustments to normalize EBITDA.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="netIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Net Income <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <p className="form-help">Your company's net income for the most recent fiscal year</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Interest Expense <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <p className="form-help">Interest paid on loans and credit facilities</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="taxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tax Expense <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <p className="form-help">Federal, state, and local income taxes</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depreciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Depreciation <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <p className="form-help">Depreciation of physical assets</p>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="amortization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amortization <span className="text-red-500">*</span>
                </FormLabel>
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
                <p className="form-help">Amortization of intangible assets</p>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          {/* Owner Adjustments Section */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Owner Adjustments</h4>
            <p className="text-slate-600 mb-6">Add back non-recurring expenses and owner-specific adjustments to normalize EBITDA.</p>
            
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
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Adjusted EBITDA Calculation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Base EBITDA</span>
                <span className="font-medium">{formatCurrency(ebitdaTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Owner Adjustments</span>
                <span className="font-medium">{formatCurrency(
                  parseFloat(watchedValues.ownerSalary || "0") +
                  parseFloat(watchedValues.personalExpenses || "0") +
                  parseFloat(watchedValues.oneTimeExpenses || "0") +
                  parseFloat(watchedValues.otherAdjustments || "0")
                )}</span>
              </div>
              <hr className="border-slate-300" />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-slate-900">Adjusted EBITDA</span>
                <span className="text-green-600">{formatCurrency(
                  ebitdaTotal +
                  parseFloat(watchedValues.ownerSalary || "0") +
                  parseFloat(watchedValues.personalExpenses || "0") +
                  parseFloat(watchedValues.oneTimeExpenses || "0") +
                  parseFloat(watchedValues.otherAdjustments || "0")
                )}</span>
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
