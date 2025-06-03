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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60">
      <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/40 rounded-t-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Contact Information</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">Please provide your contact details to begin the comprehensive valuation assessment.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
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
                    <Input {...field} placeholder="Enter your first name" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
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
                    <Input {...field} placeholder="Enter your last name" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
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
                  <Input {...field} type="email" placeholder="Enter your email address" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
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
                    <Input {...field} type="tel" placeholder="(555) 123-4567" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
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
                    <Input {...field} placeholder="Enter your company name" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
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
                  <Input {...field} placeholder="Enter your job title" className="form-input bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-purple-600 focus:ring-purple-600/20" />
                </FormControl>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-sm text-slate-700">
                <p className="font-semibold mb-2 text-slate-900">Data Privacy & Security</p>
                <p className="leading-relaxed">Your information is encrypted and secure. We will use this data solely for generating your business valuation report and will not share it with third parties.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <div></div>
            <Button type="submit" className="heritage-gradient text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Next: EBITDA Information
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
