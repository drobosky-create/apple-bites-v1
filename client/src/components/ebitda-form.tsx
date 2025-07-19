import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";

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
    <ArgonBox shadow="xl" borderRadius="xl" bgColor="white" p={8} className="border border-gray-100">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-lg">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <ArgonTypography variant="h4" fontWeight="bold" color="dark" className="mb-2">
            EBITDA & Adjustments
          </ArgonTypography>
          <ArgonTypography variant="body2" color="text" className="text-gray-600">
            Please provide your company's financial information for the most recent fiscal year and any adjustments to normalize EBITDA.
          </ArgonTypography>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="netIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-semibold text-sm">
                    Net Income <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-medium">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-12 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-8 text-slate-900 font-medium shadow-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" className="mt-2">
                    Your company's net income for the most recent fiscal year
                  </ArgonTypography>
                  <FormMessage className="text-red-500 text-sm font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-semibold text-sm">
                    Interest Expense <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-medium">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-12 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-8 text-slate-900 font-medium shadow-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" className="mt-2">
                    Interest paid on loans and credit facilities
                  </ArgonTypography>
                  <FormMessage className="text-red-500 text-sm font-medium" />
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
                  <FormLabel className="text-slate-900 font-semibold text-sm">
                    Tax Expense <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-medium">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-12 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-8 text-slate-900 font-medium shadow-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" className="mt-2">
                    Federal, state, and local income taxes
                  </ArgonTypography>
                  <FormMessage className="text-red-500 text-sm font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depreciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-semibold text-sm">
                    Depreciation <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-medium">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-12 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-8 text-slate-900 font-medium shadow-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" className="mt-2">
                    Depreciation of physical assets
                  </ArgonTypography>
                  <FormMessage className="text-red-500 text-sm font-medium" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="amortization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-semibold text-sm">
                    Amortization <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-medium">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-12 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-8 text-slate-900 font-medium shadow-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" className="mt-2">
                    Amortization of intangible assets
                  </ArgonTypography>
                  <FormMessage className="text-red-500 text-sm font-medium" />
                </FormItem>
              )}
            />
            
            {/* Empty column to maintain grid balance */}
            <div></div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">EBITDA Calculation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Net Income</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.netIncome || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Interest Expense</span>
                <span className="font-medium">{formatCurrency(parseFloat(watchedValues.interest || "0"))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">+ Tax Expense</span>
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
                <span className="text-blue-600">{formatCurrency(ebitdaTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-8 mt-8 border-t border-slate-200">
            <ArgonButton 
              type="button" 
              variant="outline"
              onClick={onPrev}
              className="order-2 sm:order-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Previous
            </ArgonButton>
            <ArgonButton 
              type="submit" 
              variant="gradient"
              color="dark"
              className="order-1 sm:order-2"
            >
              Next: Adjustments
              <ArrowRight className="ml-2 w-4 h-4" />
            </ArgonButton>
          </div>
        </form>
      </Form>
    </ArgonBox>
  );
}
