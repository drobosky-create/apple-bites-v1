import React, { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  Typography,
  Link as MuiLink,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CardContent,
} from '@mui/material';
import { Facebook, GitHub, Google, Apple, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// Direct MUI Card import
import { Card } from '@mui/material';

// Using correct Apple Bites logo from attached assets
import appleBitesLogoSrc from "@assets/3.png";
const appleBitesLogo = appleBitesLogoSrc;

// Authentic Material Dashboard Styled Components (matching the template exactly)
const MaterialBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: `
  linear-gradient(310deg, rgba(10, 20, 40, 0.75) 0%, rgba(20, 35, 60, 0.65) 40%, rgba(30, 50, 80, 0.8) 100%),
  url('/assets/twilight-city-skyline.png')
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
}));

const AuthenticationCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 350,
  margin: '0 auto',
  marginTop: '-120px',
  paddingTop: '140px',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  position: 'relative',
  backgroundColor: '#ffffff',
  zIndex: 1,
  overflow: 'visible',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  maxWidth: '320px',
  background: 'linear-gradient(135deg, rgba(116, 123, 138, 0.9) 0%, rgba(73, 83, 97, 0.9) 100%)',
  borderRadius: '16px',
  padding: '24px 16px',
  margin: '0 auto 24px auto',
  textAlign: 'center',
  color: '#ffffff',
  position: 'relative',
  zIndex: 2,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const SocialIconButton = styled(MuiLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  margin: '0 4px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-1px)',
  },
}));

const MaterialTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#d2d6da',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: '#344767',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#344767',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#67748e',
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: '#344767',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
    fontSize: '0.875rem',
    color: '#344767',
  },
}));

const SignInButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.0625rem',
  padding: '12px 24px',
  width: '100%',
  background: '#42424a',
  color: '#ffffff',
  boxShadow: '0 4px 7px -1px rgba(66, 66, 74, 0.4)',
  border: 'none',
  '&:hover': {
    background: '#3a3a40',
    boxShadow: '0 8px 16px -4px rgba(66, 66, 74, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
  },
}));

export default function AuthenticMaterialLogin() {
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

  const handleSocialLogin = (provider: string) => {
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
      <Box sx={{ 
        width: '100%', 
        maxWidth: 400, 
        position: 'relative', 
        minHeight: '620px',
        transform: 'scale(1.15)',
        transformOrigin: 'center center'
      }}>
        {/* Floating Header Section */}
        <HeaderSection
          sx={{
            position: 'absolute',
            top: '20px',
            left: 0,
            right: 0,
            mx: 'auto',
            maxWidth: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            padding: '24px 16px',
            zIndex: 2,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
            <img
              src={appleBitesLogo}
              alt="Apple Bites Business Assessment"
              style={{
                height: '225px',
                width: 'auto',
                filter: 'brightness(1.1)',
                display: 'block',
                margin: '0 auto 16px auto',
              }}
              onError={(e) => {
                console.log('Logo failed to load:', appleBitesLogo);
                // Fallback to a different logo
                (e.target as HTMLImageElement).src = '/apple-bites-logo.png';
              }}
            />

            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                fontSize: '1.25rem',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#fff',
              }}
            >
              Sign in
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
                mt: 1,
              }}
            >
              <SocialIconButton onClick={() => handleSocialLogin('facebook')}>
                <Facebook fontSize="small" />
              </SocialIconButton>
              <SocialIconButton onClick={() => handleSocialLogin('github')}>
                <GitHub fontSize="small" />
              </SocialIconButton>
              <SocialIconButton onClick={() => handleSocialLogin('google')}>
                <Google fontSize="small" />
              </SocialIconButton>
              <SocialIconButton onClick={() => handleSocialLogin('apple')}>
                <Apple fontSize="small" />
              </SocialIconButton>
              <SocialIconButton onClick={() => handleSocialLogin('email')}>
                <Email fontSize="small" />
              </SocialIconButton>
            </Box>
        </HeaderSection>

        <AuthenticationCard
          sx={{
            mt: '160px', // slight push to sit under floating header
              borderRadius: '16px',
              minHeight: '480px', // reduced height to remove bottom space
              backgroundColor: '#fff',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start', // ensures top-alignment
          }}
        >
          <CardContent sx={{ px: 4, pt: 12, pb: 4 }}>
            {/* Login Form */}
            <Box component="form" onSubmit={handleLogin}>
              <MaterialTextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                required
                disabled={isLoading}
              />

              <MaterialTextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                required
                disabled={isLoading}
              />

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#344767',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#344767',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#67748e',
                        fontSize: '0.875rem',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      }}
                    >
                      Remember me
                    </Typography>
                  }
                />
              </Box>

              <SignInButton
                type="submit"
                disabled={isLoading || !email || !password}
                sx={{ 
                  mb: 3,
                  backgroundColor: '#42424a !important',
                  '&:hover': {
                    backgroundColor: '#3a3a40 !important',
                  },
                  '&:disabled': {
                    backgroundColor: '#42424a !important',
                    opacity: 0.6,
                  }
                }}
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </SignInButton>

              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#67748e',
                    fontSize: '0.875rem',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  }}
                >
                  Don't have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={handleSignUp}
                    sx={{
                      color: '#344767',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
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
        </AuthenticationCard>

        
      </Box>
    </MaterialBackground>
  );
}