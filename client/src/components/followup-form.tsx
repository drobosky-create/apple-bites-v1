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
    <div className="space-y-8">
      {/* Executive Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0b2147] mb-2">Follow-up Preferences</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Let us know how you'd like to proceed after receiving your valuation report.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Follow-up Options Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Consultation Preferences</h3>
              
              <FormField
                control={form.control}
                name="followUpIntent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-[#0b2147] mb-4 block">
                      Would you like to discuss your valuation results with one of our experts?
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <label className="flex items-start space-x-4 p-6 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-[#0b2147]/30 transition-all">
                          <input 
                            type="radio" 
                            value="yes" 
                            checked={field.value === "yes"}
                            onChange={() => {
                              field.onChange("yes");
                              onDataChange(form.getValues());
                            }}
                            className="mt-1 w-5 h-5 text-[#0b2147]" 
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-[#0b2147] text-lg">Yes, schedule a consultation</div>
                            <div className="text-slate-600 mt-2">I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.</div>
                          </div>
                        </label>
                        
                        <label className="flex items-start space-x-4 p-6 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-[#0b2147]/30 transition-all">
                          <input 
                            type="radio" 
                            value="maybe" 
                            checked={field.value === "maybe"}
                            onChange={() => {
                              field.onChange("maybe");
                              onDataChange(form.getValues());
                            }}
                            className="mt-1 w-5 h-5 text-[#0b2147]" 
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-[#0b2147] text-lg">Maybe later</div>
                            <div className="text-slate-600 mt-2">I'd like to receive the report first and may reach out for a consultation afterward.</div>
                          </div>
                        </label>
                        
                        <label className="flex items-start space-x-4 p-6 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-[#0b2147]/30 transition-all">
                          <input 
                            type="radio" 
                            value="no" 
                            checked={field.value === "no"}
                            onChange={() => {
                              field.onChange("no");
                              onDataChange(form.getValues());
                            }}
                            className="mt-1 w-5 h-5 text-[#0b2147]" 
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-[#0b2147] text-lg">Just the report, please</div>
                            <div className="text-slate-600 mt-2">I only need the valuation report and don't require a consultation at this time.</div>
                          </div>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Comments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-[#0b2147] mb-3 block">
                      Additional Comments or Questions (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        className="border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 resize-none text-base p-4"
                        placeholder="Share any specific questions about your business valuation or areas you'd like to focus on..."
                        onChange={(e) => {
                          field.onChange(e);
                          onDataChange(form.getValues());
                        }}
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500 mt-2">
                      Help us provide the most relevant insights for your business situation.
                    </p>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:justify-between pt-8 mt-8 border-t border-slate-200">
              <button 
                type="button" 
                onClick={onPrev}
                disabled={isSubmitting}
                className="order-2 sm:order-1 px-8 py-3 text-base font-medium rounded-xl border-2 border-[#0b2147] text-[#0b2147] bg-white hover:bg-[#0b2147] hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Previous
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="order-1 sm:order-2 px-12 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#0b2147] to-[#1a365d] text-white hover:from-[#1a365d] hover:to-[#0b2147] transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-3 w-5 h-5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Send className="mr-3 w-5 h-5" />
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