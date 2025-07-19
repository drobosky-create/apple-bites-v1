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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Job Title */}
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                  Job Title
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your job title" 
                    className="h-12 text-base border-gray-200 rounded-lg focus:border-[#0b2147] focus:ring-[#0b2147]/10 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <ArgonTypography variant="h6" fontWeight="bold" color="dark" className="mb-2">
                  Data Privacy & Security
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text" className="text-gray-600 leading-relaxed">
                  Your information is encrypted and secure. We will use this data solely for generating your business valuation report and will not share it with third parties.
                </ArgonTypography>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your data is securely encrypted</span>
            </div>
            
            <ArgonButton
              variant="gradient"
              color="primary"
              size="lg"
              disabled={isSubmitting}
              type="submit"
              className="min-w-40 h-12 shadow-lg"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </ArgonButton>
          </div>
        </form>
      </Form>
    </ArgonBox>
  );
}