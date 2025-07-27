import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";


import { 
  MaterialCard, 
  MaterialCardBody, 
  MaterialButton 
} from "@/components/ui/material-dashboard-system";
import { Typography } from '@mui/material';
import { Shield, ArrowRight, User, CheckCircle, SkipForward } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";


interface ContactFormProps {
  form: UseFormReturn<ContactInfo>;
  onNext: () => void;
  onDataChange: (data: ContactInfo) => void;
}

export default function ContactForm({ form, onNext, onDataChange }: ContactFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [showPreFillOption, setShowPreFillOption] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Check if user is authenticated and has profile information
  useEffect(() => {
    if (isAuthenticated && user && (user as any).firstName && (user as any).lastName && (user as any).email) {
      setShowPreFillOption(true);
      
      // Auto pre-fill form with user data
      const userData = {
        firstName: (user as any).firstName || '',
        lastName: (user as any).lastName || '',
        email: (user as any).email || '',
        phone: '', // Phone not stored in user profile
        company: '', // Company not stored in user profile  
        jobTitle: ''
      };
      
      // Set form values
      Object.entries(userData).forEach(([key, value]) => {
        form.setValue(key as keyof ContactInfo, value);
      });
      
      setIsPreFilled(true);
    }
  }, [isAuthenticated, user, form]);

  const onSubmit = (data: ContactInfo) => {
    onDataChange(data);
    onNext();
  };

  const handleSkipToNext = () => {
    // Pre-fill with current user data and skip to next step
    const userData: ContactInfo = {
      firstName: (user as any)?.firstName || '',
      lastName: (user as any)?.lastName || '',
      email: (user as any)?.email || '',
      phone: form.getValues('phone') || '',
      company: form.getValues('company') || '',
      jobTitle: form.getValues('jobTitle') || ''
    };
    
    onDataChange(userData);
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

      {/* Pre-fill Notice for Authenticated Users */}
      {showPreFillOption && isPreFilled && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-emerald-800 mb-2">
                Welcome back, {(user as any)?.firstName}!
              </h4>
              <p className="text-emerald-700 mb-4">
                We've pre-filled your contact information from your profile. You can skip to the next step or update any details below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSkipToNext}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip to EBITDA Entry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreFillOption(false)}
                  className="px-6 py-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-all duration-200"
                >
                  Update My Information
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#747b8a] hover:bg-[#495361] text-white font-semibold px-12 py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center text-lg border-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            </button>
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