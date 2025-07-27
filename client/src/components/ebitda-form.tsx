import { UseFormReturn } from "react-hook-form";
import { EbitdaData } from "@shared/schema";




import { Typography, Card, CardContent, Button } from '@mui/material';
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
    <div >
      {/* Executive Header Section */}
      <div >
        <div >
          <Calculator  />
        </div>
        <div>
          <h1 >Financial Information</h1>
          <p >
            Please provide your company's financial information for the most recent fiscal year to calculate EBITDA.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            {/* Financial Data Section */}
            <div >
              <h3 >Financial Data</h3>
              
              <div >
            <FormField
              control={form.control}
              name="netIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Net Income <span >*</span>
                  </FormLabel>
                  <FormControl>
                    <div >
                      <span >$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" >
                    Your company's net income for the most recent fiscal year
                  </ArgonTypography>
                  <FormMessage  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Interest Expense <span >*</span>
                  </FormLabel>
                  <FormControl>
                    <div >
                      <span >$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" >
                    Interest paid on loans and credit facilities
                  </ArgonTypography>
                  <FormMessage  />
                </FormItem>
              )}
            />
          </div>

          <div >
            <FormField
              control={form.control}
              name="taxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Tax Expense <span >*</span>
                  </FormLabel>
                  <FormControl>
                    <div >
                      <span >$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" >
                    Federal, state, and local income taxes
                  </ArgonTypography>
                  <FormMessage  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depreciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Depreciation <span >*</span>
                  </FormLabel>
                  <FormControl>
                    <div >
                      <span >$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" >
                    Depreciation of physical assets
                  </ArgonTypography>
                  <FormMessage  />
                </FormItem>
              )}
            />
          </div>

          <div >
            <FormField
              control={form.control}
              name="amortization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Amortization <span >*</span>
                  </FormLabel>
                  <FormControl>
                    <div >
                      <span >$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="0" 
                        
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </div>
                  </FormControl>
                  <ArgonTypography variant="caption" color="text" >
                    Amortization of intangible assets
                  </ArgonTypography>
                  <FormMessage  />
                </FormItem>
              )}
            />
            
            {/* Empty column to maintain grid balance */}
            <div></div>
          </div>

          <div >
            <h4 >EBITDA Calculation</h4>
            <div >
              <div >
                <span >Net Income</span>
                <span >{formatCurrency(parseFloat(watchedValues.netIncome || "0"))}</span>
              </div>
              <div >
                <span >+ Interest Expense</span>
                <span >{formatCurrency(parseFloat(watchedValues.interest || "0"))}</span>
              </div>
              <div >
                <span >+ Tax Expense</span>
                <span >{formatCurrency(parseFloat(watchedValues.taxes || "0"))}</span>
              </div>
              <div >
                <span >+ Depreciation</span>
                <span >{formatCurrency(parseFloat(watchedValues.depreciation || "0"))}</span>
              </div>
              <div >
                <span >+ Amortization</span>
                <span >{formatCurrency(parseFloat(watchedValues.amortization || "0"))}</span>
              </div>
              <hr  />
              <div >
                <span >EBITDA</span>
                <span >{formatCurrency(ebitdaTotal)}</span>
              </div>
            </div>
          </div>

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
                Next: Adjustments
                <ArrowRight  />
              </button>
            </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
