import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import { Shield, ArrowRight, User } from "lucide-react";

interface ContactFormProps {
  form: UseFormReturn<ContactInfo>;
  onNext: () => void;
  onDataChange: (data: ContactInfo) => void;
}

export default function ContactForm({ form, onNext, onDataChange }: ContactFormProps) {
  const onSubmit = (data: ContactInfo) => {
    onDataChange(data);
    onNext();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="space-y-8">
      {/* Executive Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0b2147] mb-2">Contact Information</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please provide your contact details to begin the comprehensive valuation assessment.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Contact Details</h3>
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your first name" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your last name" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Email and Phone Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="Enter your email address" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="(555) 123-4567" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#0b2147] mb-6 pb-3 border-b border-slate-200">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      Company Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your company name" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0b2147] mb-3 block">
                      Job Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., CEO, Owner, President" 
                        className="h-14 text-base border-slate-300 rounded-xl focus:border-[#0b2147] focus:ring-[#0b2147]/20 transition-all shadow-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Enhanced Continue Button */}
          <div className="pt-8 border-t border-slate-200 flex justify-center">
            <ArgonButton
              type="submit"
              variant="gradient"
              color="primary"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-[#0b2147] to-[#1a365d] hover:from-[#112e5a] hover:to-[#1e4471] text-white font-semibold px-12 py-4 rounded-xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center text-lg"
              size="large"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Processing...
                </>
              ) : (
                <>
                  <span>Continue Assessment</span>
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </ArgonButton>
          </div>
        </form>
      </Form>
      </div>

      {/* Enhanced Privacy Notice */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              Your Information is Secure
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              We use enterprise-grade security to protect your data. Your information will only be used for your valuation report and follow-up communications. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}