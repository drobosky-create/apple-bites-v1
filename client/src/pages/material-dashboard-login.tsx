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
  Paper,
  Container,
} from '@mui/material';
import { Facebook, GitHub, Google, Apple, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Using direct path for logo
const appleBitesLogo = "/assets/logos/apple-bites-logo-variant-1.png";

// Exact Material Dashboard structure and styling
const AuthPageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
});

const AuthCard = styled(Paper)({
  maxWidth: '350px',
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: '15px',
  overflow: 'visible',
  position: 'relative',
  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
  margin: '0 auto',
});

const AuthCardHeader = styled(Box)({
  background: 'linear-gradient(135deg, rgba(116, 123, 138, 0.9) 0%, rgba(73, 83, 97, 0.9) 100%)',
  borderRadius: '15px',
  padding: '40px 24px 32px',
  textAlign: 'center',
  marginTop: '-40px',
  marginLeft: '16px',
  marginRight: '16px',
  position: 'relative',
  zIndex: 10,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

const AuthCardBody = styled(Box)({
  padding: '20px 24px 24px', // Reduced top padding
  paddingTop: '16px',
});

const SocialButton = styled(MuiLink)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  margin: '0 4px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    '& fieldset': {
      borderColor: '#d0d7de',
    },
    '&:hover fieldset': {
      borderColor: '#2152ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2152ff',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#7b809a',
    '&.Mui-focused': {
      color: '#2152ff',
    },
  },
});

const SignInButton = styled(Button)({
  background: 'linear-gradient(310deg, #42424a 0%, #191919 100%)',
  color: '#fff',
  borderRadius: '8px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: 'linear-gradient(310deg, #4a4a52 0%, #1f1f1f 100%)',
    boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-1px)',
  },
});

export default function MaterialDashboardLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to Replit OAuth
    window.location.href = "/api/login";
  };

  const handleSocialLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <AuthPageContainer>
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <AuthCard elevation={0}>
            <AuthCardHeader>
              <Box
                component="img"
                src="/assets/logos/apple-bites-meritage-logo.png"
                alt="Apple Bites Business Assessment"
                sx={{
                  height: '250px',
                  width: 'auto',
                  marginBottom: '8px',
                  filter: 'brightness(1.1)',
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: '#fff', // White text for contrast on dark background
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                Sign in
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <SocialButton onClick={handleSocialLogin}>
                  <Facebook sx={{ fontSize: 16 }} />
                </SocialButton>
                <SocialButton onClick={handleSocialLogin}>
                  <GitHub sx={{ fontSize: 16 }} />
                </SocialButton>
                <SocialButton onClick={handleSocialLogin}>
                  <Google sx={{ fontSize: 16 }} />
                </SocialButton>
                <SocialButton onClick={handleSocialLogin}>
                  <Apple sx={{ fontSize: 16 }} />
                </SocialButton>
                <SocialButton onClick={handleSocialLogin}>
                  <Email sx={{ fontSize: 16 }} />
                </SocialButton>
              </Box>
            </AuthCardHeader>
            <AuthCardBody>
              <Box component="form" onSubmit={handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  variant="outlined"
                />
                <StyledTextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  variant="outlined"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#2152ff',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2152ff',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: '#7b809a', fontSize: '14px' }}>
                      Remember me
                    </Typography>
                  }
                  sx={{ marginBottom: '16px' }}
                />
                <SignInButton
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ marginBottom: '16px' }}
                >
                  {loading ? 'Signing in...' : 'SIGN IN'}
                </SignInButton>
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: '#7b809a',
                    fontSize: '14px',
                  }}
                >
                  Don't have an account?{' '}
                  <MuiLink
                    href="/api/login"
                    sx={{
                      color: '#2152ff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </AuthCardBody>
          </AuthCard>
      </Container>
      <Box
        sx={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '14px',
        }}
      >
        © 2025, made with ❤️ by Creative Tim for a better web.
      </Box>
    </AuthPageContainer>
  );
}