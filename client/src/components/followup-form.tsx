import { UseFormReturn } from "react-hook-form";
import { FollowUpData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Clock } from "lucide-react";

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
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60">
      <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/40 rounded-t-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Follow-up Preferences</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">Let us know how you'd like to proceed after receiving your valuation report.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-8 space-y-6">
          <FormField
            control={form.control}
            name="followUpIntent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Would you like to discuss your valuation results with one of our experts?
                </FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-primary/30 transition-colors">
                      <input 
                        type="radio" 
                        value="yes" 
                        checked={field.value === "yes"}
                        onChange={() => {
                          field.onChange("yes");
                          onDataChange(form.getValues());
                        }}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">Yes, schedule a consultation</div>
                        <div className="text-sm text-slate-600 mt-1">I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.</div>
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-primary/30 transition-colors">
                      <input 
                        type="radio" 
                        value="maybe" 
                        checked={field.value === "maybe"}
                        onChange={() => {
                          field.onChange("maybe");
                          onDataChange(form.getValues());
                        }}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">Maybe later</div>
                        <div className="text-sm text-slate-600 mt-1">I'd like to review the report first and may reach out for a consultation in the future.</div>
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-primary/30 transition-colors">
                      <input 
                        type="radio" 
                        value="no" 
                        checked={field.value === "no"}
                        onChange={() => {
                          field.onChange("no");
                          onDataChange(form.getValues());
                        }}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">No thank you</div>
                        <div className="text-sm text-slate-600 mt-1">I just need the valuation report for my own reference.</div>
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                    className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Any specific areas of interest or questions about your business..."
                    onChange={(e) => {
                      field.onChange(e);
                      onDataChange(form.getValues());
                    }}
                  />
                </FormControl>
                <p className="form-help">Share any specific goals or questions about your business valuation</p>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Processing Time</p>
                <p>Your valuation report will be generated and emailed to you within 5-10 minutes. Please check your email and spam folder.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev}
              className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-8 py-3 rounded-lg font-medium hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              <Send className="mr-2 w-4 h-4" />
              {isSubmitting ? "Generating Report..." : "Generate Valuation Report"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
