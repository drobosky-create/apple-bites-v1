import { UseFormReturn } from "react-hook-form";
import { AdjustmentsData } from "@shared/schema";




import { 
  Card, 
  CardContent, 
  Button 
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
    <div >
      {/* Executive Header Section */}
      <div >
        <div >
          <Settings  />
        </div>
        <div>
          <h1 >EBITDA Adjustments</h1>
          <p >
            Add back expenses that don't represent the true earning potential of your business.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            {/* Adjustments Section */}
            <div >
              <h3 >Adjustment Categories</h3>
          <div >
            <FormField
              control={form.control}
              name="ownerSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excess Owner Compensation</FormLabel>
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
                  <p >Amount paid to owner above market rate for the position</p>
                  <FormMessage  />
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
                  <p >Personal expenses run through the business</p>
                  <FormMessage  />
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
                  <p >Non-recurring expenses (legal fees, consulting, etc.)</p>
                  <FormMessage  />
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
                  <p >Any other legitimate business adjustments</p>
                  <FormMessage  />
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
                    
                    placeholder="Describe any adjustments in detail..."
                    onChange={(e) => {
                      field.onChange(e);
                      onDataChange(form.getValues());
                    }}
                  />
                </FormControl>
                <p >Provide context for your adjustments to help with valuation accuracy</p>
                <FormMessage  />
              </FormItem>
            )}
          />

          <div >
            <h4 >Adjusted EBITDA Calculation</h4>
            <div >
              <div >
                <span >Base EBITDA</span>
                <span >{formatCurrency(baseEbitda)}</span>
              </div>
              <div >
                <span >+ Owner Adjustments</span>
                <span >{formatCurrency(totalAdjustments)}</span>
              </div>
              <hr  />
              <div >
                <span >Adjusted EBITDA</span>
                <span >{formatCurrency(adjustedEbitda)}</span>
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
                Next: Value Drivers
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
