import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Contact Information</h3>
        <p className="text-slate-600">Please provide your contact details to begin the valuation assessment.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your first name" className="form-input" />
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
                    <Input {...field} placeholder="Enter your last name" className="form-input" />
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
                  <Input {...field} type="email" placeholder="Enter your email address" className="form-input" />
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="(555) 123-4567" className="form-input" />
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
                    <Input {...field} placeholder="Enter your company name" className="form-input" />
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
                  <Input {...field} placeholder="Enter your job title" className="form-input" />
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">Data Privacy</p>
                <p>Your information is encrypted and secure. We will use this data solely for generating your business valuation report and will not share it with third parties.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <div></div>
            <Button type="submit" className="btn-primary px-8 py-3 rounded-lg font-medium">
              Next: EBITDA Information
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
