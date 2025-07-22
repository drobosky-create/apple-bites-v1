import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Link as MuiLink,
  Grid,
  Container,
  IconButton,
} from '@mui/material';
import { Facebook, GitHub, Google } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography 
} from "@/components/ui/argon-authentic";
import { registerUserSchema, loginUserSchema, type RegisterUser, type LoginUser } from "@shared/schema";
import appleBitesLogo from "@assets/3_1753206059591.png";

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0b1426 0%, #1a202c 25%, #2d3748 50%, #1a202c 75%, #0b1426 100%)',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2381e5d8" fill-opacity="0.05"><circle cx="7" cy="7" r="1"/><circle cx="27" cy="7" r="1"/><circle cx="47" cy="7" r="1"/><circle cx="7" cy="27" r="1"/><circle cx="27" cy="27" r="1"/><circle cx="47" cy="27" r="1"/><circle cx="7" cy="47" r="1"/><circle cx="27" cy="47" r="1"/><circle cx="47" cy="47" r="1"/></g></g></svg>')`,
  },
}));

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: 16,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  overflow: 'visible',
  position: 'relative',
  zIndex: 1,
}));

const LoginHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
  padding: theme.spacing(4, 4, 3),
  borderRadius: '16px 16px 0 0',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  margin: theme.spacing(0, 0.5),
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    '& fieldset': {
      borderColor: '#e9ecef',
    },
    '&:hover fieldset': {
      borderColor: '#dee2e6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#81e5d8',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#67748e',
  },
}));

const SignInButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #81e5d8 0%, #4493de 100%)',
  color: '#ffffff',
  borderRadius: 12,
  padding: theme.spacing(1.5, 0),
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 6px rgba(129, 229, 216, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #4493de 0%, #81e5d8 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 10px rgba(129, 229, 216, 0.4)',
  },
  '&:disabled': {
    background: '#e9ecef',
    color: '#67748e',
    transform: 'none',
    boxShadow: 'none',
  },
  transition: 'all 0.3s ease',
}));

export default function ArgonLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleSocialLogin = (provider: 'facebook' | 'github' | 'google') => {
    if (provider === 'github') {
      // Use Replit OAuth for GitHub
      window.location.href = '/api/login';
    } else {
      toast({
        title: "Coming Soon",
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available soon.`,
      });
    }
  };

  const handleSignUp = () => {
    toast({
      title: "Registration",
      description: "Please use the assessment purchase flow to create your account.",
    });
  };

  return (
    <GradientBackground>
      {/* Apple Bites Logo */}
      <Box sx={{ mb: 4, textAlign: 'center', zIndex: 2 }}>
        <img 
          src={appleBitesLogo} 
          alt="Apple Bites Business Assessment" 
          style={{
            height: '180px',
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />
      </Box>
      
      <Container maxWidth="sm" sx={{ px: 2, zIndex: 2 }}>
        <LoginCard>
          <LoginHeader>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Sign in
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <SocialButton onClick={() => handleSocialLogin('facebook')} size="small">
                <Facebook fontSize="small" />
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('github')} size="small">
                <GitHub fontSize="small" />
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('google')} size="small">
                <Google fontSize="small" />
              </SocialButton>
            </Box>
          </LoginHeader>

          <CardContent sx={{ p: 4, pt: 3 }}>
            <form onSubmit={handleLogin}>
              <Box sx={{ mb: 3 }}>
                <StyledTextField
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
                <StyledTextField
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
                          color: '#81e5d8',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#81e5d8',
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
                      color: '#81e5d8',
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
            </form>
          </CardContent>
        </LoginCard>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          © 2025, made with ❤️ by Apple Bites for a better business valuation experience.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.75rem' }}>
            Apple Bites
          </MuiLink>
          <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.75rem' }}>
            About Us
          </MuiLink>
          <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.75rem' }}>
            Support
          </MuiLink>
          <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.75rem' }}>
            License
          </MuiLink>
        </Box>
      </Box>
    </GradientBackground>
  );
}