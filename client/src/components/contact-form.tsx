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
    <div >
      {/* Executive Header Section */}
      <div >
        <div >
          <User  />
        </div>
        <div>
          <h1 >Contact Information</h1>
          <p >
            Please provide your contact details to begin the comprehensive valuation assessment.
          </p>
        </div>
      </div>

      {/* Pre-fill Notice for Authenticated Users */}
      {showPreFillOption && isPreFilled && (
        <div >
          <div >
            <CheckCircle  />
            <div >
              <h4 >
                Welcome back, {(user as any)?.firstName}!
              </h4>
              <p >
                We've pre-filled your contact information from your profile. You can skip to the next step or update any details below.
              </p>
              <div >
                <Button
                  onClick={handleSkipToNext}
                  
                >
                  <SkipForward  />
                  Skip to EBITDA Entry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreFillOption(false)}
                  
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