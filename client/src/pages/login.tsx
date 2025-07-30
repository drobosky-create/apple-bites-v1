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

            {/* Social Login Options */}
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
                onClick={() => window.location.href = '/api/auth/github'}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </Box>
              </Button>

              <Button
                onClick={() => window.location.href = '/api/auth/apple'}
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
                <Box display="flex" alignItems="center" gap={2}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                  Continue with Apple
                </Box>
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
                  background: 'linear-gradient(135deg, #00718d 0%, #3B82F6 100%)',

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