import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import { Eye, EyeOff, Mail, LogIn } from 'lucide-react';
import MDInput from '@/components/MD/MDInput';
const appleBitesLogo = '/assets/logos/apple-bites-meritage-logo.png';

interface LoginFormData {
  email: string;
  password: string;
}

export default function HybridLoginPage() {
  const theme = useTheme();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setLocation('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  // Handle Demo Account
  const handleDemoLogin = () => {
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
                Sign In
              </Typography>
              <Typography variant="body1" sx={{ color: '#718096' }}>
                Access your business valuation dashboard
              </Typography>
            </Box>

            {/* Google & Demo Buttons */}
            <Box mb={3}>
              <Button
                onClick={handleGoogleLogin}
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
                    borderColor: '#00718d',
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
                onClick={handleDemoLogin}
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  '&:hover': {
                    borderColor: '#00718d',
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
                or sign in with email
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

            {/* Email Field */}
            <Box mb={3}>
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
                    '&:hover fieldset': { borderColor: '#00718d' },
                    '&.Mui-focused fieldset': { borderColor: '#00718d' }
                  }
                }}
              />
            </Box>

            {/* Password Field */}
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#374151' }}>
                  Password
                </Typography>
                <Link href="/forgot-password">
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00718d',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </Box>
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
                    '&:hover fieldset': { borderColor: '#00718d' },
                    '&.Mui-focused fieldset': { borderColor: '#00718d' }
                  }
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              sx={{
                width: '100%',
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00718d 0%, #33FFC5 100%)',
                  boxShadow: '0 8px 25px -8px rgba(0,191,166,0.4)'
                },
                '&:disabled': {
                  background: '#E5E7EB',
                  color: '#9CA3AF'
                }
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Sign Up Redirect */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Don't have an account?{' '}
                <Link href="/signup">
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: '#00718d', 
                      fontWeight: 'medium', 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Create one here
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
      </Box>
    </Box>
  );
}