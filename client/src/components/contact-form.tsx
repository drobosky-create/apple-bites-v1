import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";


import { Typography, Card, CardContent, Button } from '@mui/material';
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Executive Header Section */}
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h1>
          <p className="text-gray-600">
            Please provide your contact details to begin the comprehensive valuation assessment.
          </p>
        </div>
      </div>

      {/* Pre-fill Notice for Authenticated Users */}
      {showPreFillOption && isPreFilled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-1">
                Welcome back, {(user as any)?.firstName}!
              </h4>
              <p className="text-green-700 text-sm mb-3">
                We've pre-filled your contact information from your profile. You can skip to the next step or update any details below.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleSkipToNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip to EBITDA Entry
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowPreFillOption(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm"
                >
                  Update My Information
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            {/* Contact Details Section */}
            <div >
              <h3 >Contact Details</h3>
            
            {/* Name Fields */}
            <div >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      First Name <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your first name" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Last Name <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your last name" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </div>

            {/* Email and Phone Fields */}
            <div >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Email Address <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="Enter your email address" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Phone Number <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="(555) 123-4567" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div >
            <h3 >Business Information</h3>
            
            <div >
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Company Name <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your company name" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Job Title <span >*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., CEO, Owner, President" 
                        
                      />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Enhanced Continue Button */}
          <div >
            <button
              type="submit"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? (
                <>
                  <div  />
                  Processing...
                </>
              ) : (
                <>
                  <span>Continue Assessment</span>
                  <ArrowRight  />
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
      </div>

      {/* Enhanced Privacy Notice */}
      <div >
        <div >
          <div >
            <Shield  />
          </div>
          <div>
            <h4 >
              Your Information is Secure
            </h4>
            <p >
              We use enterprise-grade security to protect your data. Your information will only be used for your valuation report and follow-up communications. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}