import { UseFormReturn } from "react-hook-form";
import { FollowUpData } from "@shared/schema";


import { ArrowLeft, Send, Clock, MessageSquare } from "lucide-react";


interface FollowUpFormProps {
  form: UseFormReturn<FollowUpData>;
  onSubmit: () => void;
  onPrev: () => void;
  onDataChange: (data: FollowUpData) => void;
  isSubmitting: boolean;
}

export default function FollowUpForm({ form, onSubmit, onPrev, onDataChange, isSubmitting }: FollowUpFormProps) {
  const handleSubmit = (data: FollowUpData) => {
    onDataChange(data);
    onSubmit();
    // Scroll to top when generating report
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div >
      {/* Executive Header Section */}
      <div >
        <div >
          <MessageSquare  />
        </div>
        <div>
          <h1 >Follow-up Preferences</h1>
          <p >
            Let us know how you'd like to proceed after receiving your valuation report.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} >
            {/* Follow-up Options Section */}
            <div >
              <h3 >Consultation Preferences</h3>
              
              <FormField
                control={form.control}
                name="followUpIntent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Would you like to discuss your valuation results with one of our experts?
                    </FormLabel>
                    <FormControl>
                      <div >
                        <label >
                          <input 
                            type="radio" 
                            value="yes" 
                            checked={field.value === "yes"}
                            onChange={() => {
                              field.onChange("yes");
                              onDataChange(form.getValues());
                            }}
                             
                          />
                          <div >
                            <div >Yes, schedule a consultation</div>
                            <div >I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.</div>
                          </div>
                        </label>
                        
                        <label >
                          <input 
                            type="radio" 
                            value="maybe" 
                            checked={field.value === "maybe"}
                            onChange={() => {
                              field.onChange("maybe");
                              onDataChange(form.getValues());
                            }}
                             
                          />
                          <div >
                            <div >Maybe later</div>
                            <div >I'd like to receive the report first and may reach out for a consultation afterward.</div>
                          </div>
                        </label>
                        
                        <label >
                          <input 
                            type="radio" 
                            value="no" 
                            checked={field.value === "no"}
                            onChange={() => {
                              field.onChange("no");
                              onDataChange(form.getValues());
                            }}
                             
                          />
                          <div >
                            <div >Just the report, please</div>
                            <div >I only need the valuation report and don't require a consultation at this time.</div>
                          </div>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Comments Section */}
            <div >
              <h3 >Additional Information</h3>
              
              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Additional Comments or Questions (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        
                        placeholder="Share any specific questions about your business valuation or areas you'd like to focus on..."
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </FormControl>
                    <p >
                      Help us provide the most relevant insights for your business situation.
                    </p>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation Buttons */}
            <div >
              <button 
                type="button" 
                onClick={onPrev}
                disabled={isSubmitting}
                
              >
                <ArrowLeft  />
                Previous
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                
              >
                {isSubmitting ? (
                  <>
                    <Clock  />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Send  />
                    Generate Valuation Report
                  </>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}