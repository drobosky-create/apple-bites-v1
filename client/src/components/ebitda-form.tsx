import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";




import { 
  MaterialCard, 
  MaterialCardBody, 
  MaterialButton 
} from "@/components/ui/material-dashboard-system";
import { Typography } from '@mui/material';
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
    <div className="space-y-8">
      {/* Executive Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0b2147] mb-2">Financial Information</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please provide your company's financial information for the most recent fiscal year to calculate EBITDA.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Financial Data Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Financial Data</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="netIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                    Net Income <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-slate-500 font-medium text-lg">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-14 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-10 text-slate-900 font-medium shadow-sm rounded-xl"
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
                  <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                    Interest Expense <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-slate-500 font-medium text-lg">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-14 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-10 text-slate-900 font-medium shadow-sm rounded-xl"
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
                  <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                    Tax Expense <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-slate-500 font-medium text-lg">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        className="h-14 bg-white border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]/20 pl-10 text-slate-900 font-medium shadow-sm rounded-xl"
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
                Next: Adjustments
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
