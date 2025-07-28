import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, LogIn } from 'lucide-react';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import appleBitesLogo from '@assets/apple-bites-logo.png';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard on successful login
        setLocation('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to Replit Auth OAuth flow
    window.location.href = '/api/auth/google';
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/setup-demo', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        setLocation('/dashboard');
      } else {
        setError('Failed to setup demo session');
      }
    } catch (error) {
      setError('Failed to setup demo session');
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
          maxWidth: 420,
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
            Welcome Back
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#6B7280' }}>
            Sign in to access your business valuation dashboard
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

        {/* OAuth Buttons */}
        <MDBox mb={4}>
          <MDButton
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            sx={{
              width: '100%',
              py: 1.5,
              border: '1px solid #D1D5DB',
              backgroundColor: 'white',
              color: '#374151',
              borderRadius: 2,
              fontWeight: 'medium',
              textTransform: 'none',
              mb: 2,
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderColor: '#9CA3AF'
              },
              '&:disabled': {
                backgroundColor: '#F3F4F6',
                color: '#9CA3AF'
              }
            }}
          >
            <MDBox display="flex" alignItems="center" gap={2}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                style={{ width: 18, height: 18 }}
              />
              Continue with Google
            </MDBox>
          </MDButton>

          <MDButton
            onClick={handleDemoLogin}
            disabled={isLoading}
            sx={{
              width: '100%',
              py: 1.5,
              border: '1px solid #00BFA6',
              backgroundColor: 'white',
              color: '#00BFA6',
              borderRadius: 2,
              fontWeight: 'medium',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F0FDFA',
                borderColor: '#0A1F44'
              },
              '&:disabled': {
                backgroundColor: '#F3F4F6',
                color: '#9CA3AF',
                borderColor: '#D1D5DB'
              }
            }}
          >
            Try Demo Account
          </MDButton>
        </MDBox>

        {/* Divider */}
        <MDBox display="flex" alignItems="center" mb={4}>
          <MDBox flex={1} sx={{ height: '1px', backgroundColor: '#E5E7EB' }} />
          <MDTypography variant="body2" sx={{ color: '#9CA3AF', px: 2 }}>
            or sign in with email
          </MDTypography>
          <MDBox flex={1} sx={{ height: '1px', backgroundColor: '#E5E7EB' }} />
        </MDBox>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <MDBox mb={3}>
            <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151', mb: 1 }}>
              Email Address
            </MDTypography>
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
          </MDBox>

          {/* Password */}
          <MDBox mb={4}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#374151' }}>
                Password
              </MDTypography>
              <Link href="/forgot-password">
                <MDTypography
                  variant="caption"
                  sx={{
                    color: '#00BFA6',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot password?
                </MDTypography>
              </Link>
            </MDBox>
            <MDInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
          </MDBox>

          {/* Submit Button */}
          <MDButton
            type="submit"
            disabled={isLoading}
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
            startIcon={<LogIn size={18} />}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </MDButton>
        </form>

        {/* Signup Link */}
        <MDBox textAlign="center" mt={4}>
          <MDTypography variant="body2" sx={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link href="/signup">
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
                Create one here
              </MDTypography>
            </Link>
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}