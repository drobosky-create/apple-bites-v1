import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import { Shield, ArrowRight } from "lucide-react";

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

  return (
    <ArgonBox shadow="lg" borderRadius="lg" bgColor="white">
      <ArgonBox p={3} bgColor="white" borderRadius="lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <ArgonTypography variant="h4" fontWeight="bold" color="dark">Contact Information</ArgonTypography>
        </div>
        <ArgonTypography variant="body2" color="text">Please provide your contact details to begin the comprehensive valuation assessment.</ArgonTypography>
      </ArgonBox>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ArgonBox p={3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your first name" 
                      className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </FormControl>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your last name" 
                      className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </FormControl>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    placeholder="Enter your email address" 
                    className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      placeholder="(555) 123-4567" 
                      className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </FormControl>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your company name" 
                      className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </FormControl>
                  <FormMessage className="form-error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your job title" 
                    className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
            <div className="flex items-start space-x-3 bg-[#f0f6ff]">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-sm text-slate-700">
                <p className="font-semibold mb-2 text-slate-900">Data Privacy & Security</p>
                <p className="leading-relaxed">Your information is encrypted and secure. We will use this data solely for generating your business valuation report and will not share it with third parties.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 sm:pt-8">
            <div></div>
            <ArgonButton 
              type="submit" 
              variant="gradient"
              color="success"
              size="large"
              disabled={!form.formState.isValid}
            >
              Next: EBITDA Information
              <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
            </ArgonButton>
          </div>
          </ArgonBox>
        </form>
      </Form>
    </ArgonBox>
  );
}
