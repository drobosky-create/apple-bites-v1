import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Box, 
  Grid,
  Alert,
  IconButton
} from '@mui/material';
import { Shield, ArrowRight, User, CheckCircle, SkipForward } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

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
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox display="flex" alignItems="center" mb={4}>
        <MDBox mr={3}>
          <MDBox 
            width="48px" 
            height="48px" 
            borderRadius="50%" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{ 
              background: 'linear-gradient(135deg, #00BFA6 0%, #5EEAD4 100%)',
              boxShadow: '0 4px 12px rgba(0, 191, 166, 0.3)'
            }}
          >
            <User size={24} color="white" />
          </MDBox>
        </MDBox>
        <MDBox>
          <MDTypography variant="h3" fontWeight="bold" color="dark" mb={1} sx={{ fontSize: '28px' }}>
            Contact Information
          </MDTypography>
          <MDTypography variant="body1" color="text" opacity={0.8}>
            Please provide your contact details to begin the comprehensive valuation assessment.
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Pre-fill Notice for Authenticated Users */}
      {showPreFillOption && isPreFilled && (
        <MDBox mb={4}>
          <Alert 
            severity="success" 
            sx={{ 
              borderRadius: '12px',
              '& .MuiAlert-icon': { fontSize: '20px' }
            }}
          >
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium" color="success" mb={1}>
                Welcome back, {(user as any)?.firstName}!
              </MDTypography>
              <MDTypography variant="body2" color="success" mb={2}>
                We've pre-filled your contact information from your profile. You can skip to the next step or update any details below.
              </MDTypography>
              <MDBox display="flex" gap={2}>
                <MDButton
                  onClick={handleSkipToNext}
                  variant="gradient"
                  color="primary"
                  size="small"
                >
                  <SkipForward size={16} style={{ marginRight: '8px' }} />
                  Skip to EBITDA Entry
                </MDButton>
                <MDButton
                  onClick={() => setShowPreFillOption(false)}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Update My Information
                </MDButton>
              </MDBox>
            </MDBox>
          </Alert>
        </MDBox>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ padding: '32px' }}>
            {/* Contact Details Section */}
            <MDBox mb={4}>
              <MDTypography variant="h5" fontWeight="bold" color="dark" mb={3} sx={{ fontSize: '28px' }}>
                Contact Details
              </MDTypography>
              
              {/* Name Fields */}
              <Grid container spacing={3} mb={3}>
                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      First Name <span style={{ color: '#f44336' }}>*</span>
                    </MDTypography>
                    <TextField
                      {...register('firstName', { required: 'First name is required' })}
                      fullWidth
                      placeholder="Enter your first name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>

                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      Last Name <span style={{ color: '#f44336' }}>*</span>
                    </MDTypography>
                    <TextField
                      {...register('lastName', { required: 'Last name is required' })}
                      fullWidth
                      placeholder="Enter your last name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              {/* Email and Phone Fields */}
              <Grid container spacing={3} mb={3}>
                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      Email Address <span style={{ color: '#f44336' }}>*</span>
                    </MDTypography>
                    <TextField
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      fullWidth
                      type="email"
                      placeholder="Enter your email address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>

                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      Phone Number
                    </MDTypography>
                    <TextField
                      {...register('phone')}
                      fullWidth
                      placeholder="Enter your phone number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            {/* Business Information Section */}
            <MDBox mb={4}>
              <MDTypography variant="h5" fontWeight="bold" color="dark" mb={3} sx={{ fontSize: '28px' }}>
                Business Information
              </MDTypography>
              
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      Company Name <span style={{ color: '#f44336' }}>*</span>
                    </MDTypography>
                    <TextField
                      {...register('company', { required: 'Company name is required' })}
                      fullWidth
                      placeholder="Enter your company name"
                      error={!!errors.company}
                      helperText={errors.company?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>

                <Grid xs={12} md={6}>
                  <MDBox>
                    <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                      Job Title
                    </MDTypography>
                    <TextField
                      {...register('jobTitle')}
                      fullWidth
                      placeholder="Enter your job title"
                      error={!!errors.jobTitle}
                      helperText={errors.jobTitle?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            {/* Continue Button */}
            <MDBox display="flex" justifyContent="flex-end" mb={4}>
              <MDButton
                type="submit"
                variant="gradient"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{ 
                  minWidth: '200px',
                  background: '#00BFA6',
                  borderRadius: '8px',
                  '&:hover': {
                    background: '#008e7e',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(0, 191, 166, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Continue to EBITDA'}
                <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </MDButton>
            </MDBox>

            {/* Privacy Notice */}
            <MDBox>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 191, 166, 0.1)',
                  border: '1px solid rgba(0, 191, 166, 0.3)'
                }}
              >
                <MDBox display="flex" alignItems="center">
                  <Shield size={16} style={{ marginRight: '8px', color: '#00BFA6' }} />
                  <MDTypography variant="body2" color="dark">
                    Your information is secure and will only be used for your business valuation assessment.
                  </MDTypography>
                </MDBox>
              </Alert>
            </MDBox>
          </CardContent>
        </Card>
      </form>
    </MDBox>
  );
}