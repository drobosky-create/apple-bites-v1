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
    <ArgonBox shadow="xl" borderRadius="xl" bgColor="white" p={8} className="border border-gray-100">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <ArgonTypography variant="h4" fontWeight="bold" color="dark" className="mb-2">
            Contact Information
          </ArgonTypography>
          <ArgonTypography variant="body2" color="text" className="text-gray-600">
            Please provide your contact details to begin the comprehensive valuation assessment.
          </ArgonTypography>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Details Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">Contact Details</h3>
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your first name" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
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
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your last name" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
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
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="Enter your email address" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
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
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="(555) 123-4567" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
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
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      Company Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your company name" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
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
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                      Job Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., CEO, Owner, President" 
                        className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Enhanced Continue Button */}
          <div className="pt-6 border-t border-gray-100">
            <ArgonButton
              type="submit"
              variant="gradient"
              color="primary"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-[#0b2147] to-[#1a365d] hover:from-[#112e5a] hover:to-[#1e4471] text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center w-full md:w-auto md:ml-auto"
              size="large"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <span>Continue Assessment</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </ArgonButton>
          </div>
        </form>
      </Form>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Your Information is Secure
            </p>
            <p className="text-xs text-blue-700">
              We use enterprise-grade security to protect your data. Your information will only be used for your valuation report and follow-up communications.
            </p>
          </div>
        </div>
      </div>
    </ArgonBox>
  );
}