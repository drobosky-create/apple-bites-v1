import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
        <h3 className="text-xl font-semibold text-slate-900 mb-2">EBITDA Calculation</h3>
        <p className="text-slate-600">Please provide your company's financial information for the most recent fiscal year.</p>
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                        className="form-input pl-8"
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
                      className="form-input pl-8"
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

          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">EBITDA Calculation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Net Income</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.netIncome || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Interest</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.interest || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Taxes</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.taxes || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Depreciation</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.depreciation || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Amortization</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.amortization || "0"))}</span>
              </div>
              <hr className="border-slate-300" />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-slate-900">EBITDA</span>
                <span className="text-primary">{formatCurrency(ebitdaTotal)}</span>
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
              Next: Adjustments
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
