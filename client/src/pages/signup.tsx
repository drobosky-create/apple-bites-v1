import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, User, Building, CheckCircle, X } from 'lucide-react';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import appleBitesLogo from '@assets/apple-bites-logo.png';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  title: string;
}

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
    {met ? (
      <CheckCircle size={14} color="#10B981" />
    ) : (
      <X size={14} color="#EF4444" />
    )}
    <MDTypography variant="caption" sx={{ color: met ? '#10B981' : '#6B7280', fontSize: '12px' }}>
      {text}
    </MDTypography>
  </MDBox>
);

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    title: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password validation
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
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          company: formData.company,
          title: formData.title
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard on successful signup
        setLocation('/dashboard');
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MDBox
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <MDBox
        sx={{
          maxWidth: 480,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 3,
          padding: 4,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <MDBox textAlign="center" mb={4}>
          <img
            src={appleBitesLogo}
            alt="Apple Bites"
            style={{
              height: 60,
              width: 'auto',
              marginBottom: 16
            }}
          />
          <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#0A1F44', mb: 1 }}>
            Create Your Account
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#6B7280' }}>
            Start your business valuation journey with Apple Bites
          </MDTypography>
        </MDBox>

        {/* Error Message */}
        {error && (
          <MDBox
            sx={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 2,
              padding: 2,
              mb: 3
            }}
          >
            <MDTypography variant="body2" sx={{ color: '#DC2626' }}>
              {error}
            </MDTypography>
          </MDBox>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <MDBox display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
            <MDBox>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                First Name
              </MDTypography>
              <MDInput
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#00BFA6' },
                    '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                  }
                }}
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                Last Name
              </MDTypography>
              <MDInput
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#00BFA6' },
                    '&.Mui-focused fieldset': { borderColor: '#00BFA6' }
                  }
                }}
              />
            </MDBox>
          </MDBox>

          {/* Email */}
          <MDBox mb={3}>
            <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
              Email Address
            </MDTypography>
            <MDInput
              type="email"
              placeholder="john@company.com"
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
          </MDBox>

          {/* Company & Title */}
          <MDBox display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
            <MDBox>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                Company
              </MDTypography>
              <MDInput
                placeholder="Your Company"
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
            </MDBox>
            <MDBox>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
                Title
              </MDTypography>
              <MDInput
                placeholder="CEO, CFO, etc."
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
            </MDBox>
          </MDBox>

          {/* Password */}
          <MDBox mb={3}>
            <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
              Password
            </MDTypography>
            <MDInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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
            
            {/* Password Requirements */}
            {formData.password && (
              <MDBox mt={2} p={2} sx={{ backgroundColor: '#F9FAFB', borderRadius: 2 }}>
                <MDTypography variant="caption" fontWeight="medium" sx={{ color: '#374151', mb: 1, display: 'block' }}>
                  Password Requirements:
                </MDTypography>
                <PasswordRequirement met={passwordRequirements.length} text="At least 8 characters" />
                <PasswordRequirement met={passwordRequirements.uppercase} text="One uppercase letter" />
                <PasswordRequirement met={passwordRequirements.lowercase} text="One lowercase letter" />
                <PasswordRequirement met={passwordRequirements.number} text="One number" />
                <PasswordRequirement met={passwordRequirements.special} text="One special character" />
              </MDBox>
            )}
          </MDBox>

          {/* Confirm Password */}
          <MDBox mb={4}>
            <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
              Confirm Password
            </MDTypography>
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
              <MDTypography variant="caption" sx={{ color: '#EF4444', mt: 1, display: 'block' }}>
                Passwords do not match
              </MDTypography>
            )}
          </MDBox>

          {/* Submit Button */}
          <MDButton
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            sx={{
              background: 'linear-gradient(135deg, #00BFA6 0%, #0A1F44 100%)',
              color: 'white',
              width: '100%',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #00BFA6 0%, #33FFC5 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px -8px rgba(0, 191, 166, 0.4)'
              },
              '&:disabled': {
                background: '#D1D5DB',
                color: '#9CA3AF',
                transform: 'none',
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </MDButton>
        </form>

        {/* Login Link */}
        <MDBox textAlign="center" mt={4}>
          <MDTypography variant="body2" sx={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link href="/login">
              <MDTypography
                component="span"
                variant="body2"
                sx={{
                  color: '#00BFA6',
                  fontWeight: 'medium',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign in here
              </MDTypography>
            </Link>
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}