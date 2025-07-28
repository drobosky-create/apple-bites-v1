import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import { Eye, EyeOff, Mail, User, Building, CheckCircle, X, Phone } from 'lucide-react';
import MDInput from '@/components/MD/MDInput';
const appleBitesLogo = '/assets/logos/apple-bites-meritage-logo.png';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  company: string;
  title: string;
}

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
    {met ? <CheckCircle size={14} color="#10B981" /> : <X size={14} color="#EF4444" />}
    <Typography fontSize={12} sx={{ color: met ? '#10B981' : '#6B7280' }}>
      {text}
    </Typography>
  </Box>
);

const requirementLabels = {
  length: 'At least 8 characters',
  uppercase: 'One uppercase letter',
  lowercase: 'One lowercase letter',
  number: 'One number',
  special: 'One special character'
};

export default function HybridSignupPage() {
  const theme = useTheme();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    title: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleInputChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return setError('Password does not meet requirements');
    if (!passwordsMatch) return setError('Passwords do not match');
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setLocation('/dashboard');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/google';
  };

  // Handle Demo Account
  const handleDemoSignup = () => {
    setLocation('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Visual Panel */}
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          display: { xs: 'none', md: 'flex' },
          background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 100 0 L 0 0 0 100" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          <Box
            component="img"
            src={appleBitesLogo}
            alt="Apple Bites"
            sx={{
              height: 420,
              width: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: { xs: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', md: '#FFFFFF' },
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 0 }
        }}
      >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: 600 },
              backgroundColor: { xs: 'white', md: 'transparent' },
              borderRadius: { xs: 3, md: 0 },
              p: { xs: 4, md: 0 },
              boxShadow: { xs: 4, md: 'none' }
            }}
          >
            {/* Logo for mobile */}
            <Box textAlign="center" mb={4} sx={{ display: { md: 'none' } }}>
              <img src={appleBitesLogo} alt="Apple Bites" style={{ height: 60 }} />
            </Box>

            {/* Header */}
            <Box mb={4}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#1A202C', mb: 1 }}>
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ color: '#718096' }}>
                Start your business valuation journey
              </Typography>
            </Box>

            {/* Google & Demo Buttons */}
            <Box mb={3}>
              <Button
                onClick={handleGoogleSignup}
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  '&:hover': {
                    borderColor: '#00BFA6',
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{ width: 18, height: 18 }}
                  />
                  Continue with Google
                </Box>
              </Button>

              <Button
                onClick={handleDemoSignup}
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  '&:hover': {
                    borderColor: '#00BFA6',
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                Try Demo Account
              </Button>
            </Box>

            {/* Divider */}
            <Box display="flex" alignItems="center" mb={3}>
              <Box flex={1} sx={{ height: '1px', backgroundColor: '#E5E7EB' }} />
              <Typography variant="body2" sx={{ color: '#9CA3AF', px: 2 }}>
                or sign up with email
              </Typography>
              <Box flex={1} sx={{ height: '1px', backgroundColor: '#E5E7EB' }} />
            </Box>

            {/* Error Display */}
            {error && (
              <Box
                sx={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 2,
                  p: 2,
                  mb: 3
                }}
              >
                <Typography sx={{ color: '#DC2626', fontSize: 14 }}>
                  {error}
                </Typography>
              </Box>
            )}

            {/* Form Fields */}
            <Grid container spacing={4} sx={{ width: '100%' }}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  First Name
                </Typography>
                <MDInput
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  fullWidth
                  startAdornment={<User size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Last Name
                </Typography>
                <MDInput
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  fullWidth
                  startAdornment={<User size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Email Address
                </Typography>
                <MDInput
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  fullWidth
                  startAdornment={<Mail size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Phone Number
                </Typography>
                <MDInput
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  fullWidth
                  startAdornment={<Phone size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Company
                </Typography>
                <MDInput
                  placeholder="Company name"
                  value={formData.company}
                  onChange={handleInputChange('company')}
                  fullWidth
                  startAdornment={<Building size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Job Title
                </Typography>
                <MDInput
                  placeholder="Your title"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  fullWidth
                  startAdornment={<User size={18} color="#9CA3AF" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Password
                </Typography>
                <MDInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  fullWidth
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </button>
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#D1D5DB' },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                  Confirm Password
                </Typography>
                <MDInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                  fullWidth
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </button>
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { 
                        borderColor: formData.confirmPassword && !passwordsMatch ? '#EF4444' : '#D1D5DB' 
                      },
                      '&:hover fieldset': { borderColor: '#00BFA6' },
                      '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                    }
                  }}
                />
                {formData.confirmPassword && !passwordsMatch && (
                  <Typography variant="caption" sx={{ color: '#EF4444', mt: 1, display: 'block' }}>
                    Passwords do not match
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {/* Password Requirements */}
                {formData.password && (
                  <Box mt={1} p={2} sx={{ backgroundColor: '#F9FAFB', borderRadius: 2 }}>
                    <Typography variant="caption" fontWeight="medium" sx={{ color: '#374151', mb: 1, display: 'block' }}>
                      Password Requirements:
                    </Typography>
                    {Object.entries(passwordRequirements).map(([key, met]) => (
                      <PasswordRequirement 
                        key={key} 
                        met={met} 
                        text={requirementLabels[key as keyof typeof requirementLabels]} 
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              sx={{
                mt: 3,
                width: '100%',
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)',
                  boxShadow: '0 8px 25px -8px rgba(0,191,166,0.4)'
                },
                '&:disabled': {
                  background: '#E5E7EB',
                  color: '#9CA3AF'
                }
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Sign In Redirect */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Already have an account?{' '}
                <Link href="/login">
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: '#00BFA6', 
                      fontWeight: 'medium', 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign in here
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
      </Box>
    </Box>
  );
}