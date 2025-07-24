import React, { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CardContent,
} from '@mui/material';
import { Facebook, GitHub, Google, Apple, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

// Using direct path for logo
const appleBitesLogo = "/assets/logos/apple-bites-logo-variant-1.png";

// Material Dashboard Styled Components
const MaterialBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const MaterialCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  borderRadius: 15,
  overflow: 'visible',
  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
}));

const SocialIconButton = styled(MuiLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: '#f8f9fa',
  color: '#344767',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#e9ecef',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
  },
}));

const MaterialTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& fieldset': {
      borderColor: '#d2d6da',
    },
    '&:hover fieldset': {
      borderColor: '#5e72e4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5e72e4',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#67748e',
    '&.Mui-focused': {
      color: '#5e72e4',
    },
  },
}));

const SignInButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: '12px 24px',
  background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
  boxShadow: '0 4px 7px -1px rgba(121, 40, 202, 0.4)',
  '&:hover': {
    boxShadow: '0 8px 16px -4px rgba(121, 40, 202, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
  },
}));

export default function MaterialLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Login failed");
      }
      
      const data = await response.json();
      toast({
        title: "Welcome back!",
        description: `Logged in to your ${data.user?.tier || 'free'} account`,
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'facebook' | 'github' | 'google' | 'apple' | 'email') => {
    // All providers are supported via Replit Auth
    window.location.href = '/api/login';
  };

  const handleSignUp = () => {
    toast({
      title: "Registration",
      description: "Please use the assessment purchase flow to create your account.",
    });
  };

  return (
    <MaterialBackground>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* Apple Bites Logo */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img
            src="/apple-bites-logo-new.png"
            alt="Apple Bites Business Assessment"
            style={{
              height: '120px',
              width: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          />
        </Box>

        <MaterialCard>
          <CardContent sx={{ p: 4 }}>
            {/* Header with exact Material UI structure */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#344767',
                  fontWeight: 600,
                  mb: 1,
                  fontSize: '1.5rem'
                }}
              >
                Sign in
              </Typography>
              
              {/* Social Login Grid - exact MUI structure */}
              <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                <Grid size={2}>
                  <SocialIconButton onClick={() => handleSocialLogin('google')}>
                    <Google fontSize="small" />
                  </SocialIconButton>
                </Grid>
                <Grid size={2}>
                  <SocialIconButton onClick={() => handleSocialLogin('github')}>
                    <GitHub fontSize="small" />
                  </SocialIconButton>
                </Grid>
                <Grid size={2}>
                  <SocialIconButton onClick={() => handleSocialLogin('facebook')}>
                    <Facebook fontSize="small" />
                  </SocialIconButton>
                </Grid>
                <Grid size={2}>
                  <SocialIconButton onClick={() => handleSocialLogin('apple')}>
                    <Apple fontSize="small" />
                  </SocialIconButton>
                </Grid>
                <Grid size={2}>
                  <SocialIconButton onClick={() => handleSocialLogin('email')}>
                    <Email fontSize="small" />
                  </SocialIconButton>
                </Grid>
              </Grid>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleLogin}>
              <Box sx={{ mb: 3 }}>
                <MaterialTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                  disabled={isLoading}
                  size="medium"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <MaterialTextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  required
                  disabled={isLoading}
                  size="medium"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#5e72e4',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#5e72e4',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#67748e' }}>
                      Remember me
                    </Typography>
                  }
                />
              </Box>

              <SignInButton
                type="submit"
                fullWidth
                disabled={isLoading || !email || !password}
                sx={{ mb: 3 }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </SignInButton>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#67748e' }}>
                  Don't have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={handleSignUp}
                    sx={{
                      color: '#5e72e4',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MaterialCard>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            © 2025, made with ❤️ by Apple Bites for a better business valuation experience.
          </Typography>
        </Box>
      </Box>
    </MaterialBackground>
  );
}