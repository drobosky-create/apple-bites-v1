import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Email, Lock, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { registerUserSchema, type RegisterUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Using direct path for logo
const appleBitesLogo = "/assets/logos/apple-bites-logo-variant-3.png";

// Styled Components
const LoginBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0b2147 0%, #1a365d 50%, #2a4a73 100%)',
  backgroundImage: 'url(/assets/twilight-city-skyline.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(11, 33, 71, 0.7)',
    backdropFilter: 'blur(2px)',
  },
}));

const AuthenticationCard = styled(Box)(({ theme }) => ({
  marginTop: '175px', // Push below floating header
  maxWidth: '400px',
  margin: '175px auto 0 auto',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '32px 24px',
  position: 'relative',
  zIndex: 1,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-40px',
  left: 0,
  right: 0,
  margin: '0 auto',
  maxWidth: '300px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  padding: '24px 16px',
  zIndex: 2,
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const SignUpButton = styled(Button)({
  background: 'linear-gradient(310deg, #42424a 0%, #191919 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px 28px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    background: 'linear-gradient(310deg, #4a4a52 0%, #1f1f1f 100%)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: '#e0e0e0',
    color: '#999',
  },
});

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterUser & { confirmPassword: string }>({
    resolver: zodResolver(registerUserSchema.extend({
      confirmPassword: registerUserSchema.shape.password
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: RegisterUser) => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to Apple Bites. You can now access your dashboard.",
      });
      
      // Add small delay to ensure toast is shown
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.error || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterUser & { confirmPassword: string }) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  return (
    <LoginBackground>
      <Container maxWidth="sm">
        <Box sx={{ 
          position: 'relative',
          minHeight: '450px',
          transform: 'scale(1.15)',
          transformOrigin: 'center center'
        }}>
          {/* Floating Header Section */}
          <HeaderSection>
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
              Create Account
            </Typography>
          </HeaderSection>

          <AuthenticationCard>
            <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...form.register("firstName")}
                  error={!!form.formState.errors.firstName}
                  helperText={form.formState.errors.firstName?.message}
                  margin="normal"
                  disabled={signupMutation.isPending}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputLabel-root': { color: '#67748e' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...form.register("email")}
                  error={!!form.formState.errors.email}
                  helperText={form.formState.errors.email?.message}
                  margin="normal"
                  disabled={signupMutation.isPending}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputLabel-root': { color: '#67748e' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register("password")}
                  error={!!form.formState.errors.password}
                  helperText={form.formState.errors.password?.message}
                  margin="normal"
                  disabled={signupMutation.isPending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputLabel-root': { color: '#67748e' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...form.register("confirmPassword")}
                  error={!!form.formState.errors.confirmPassword}
                  helperText={form.formState.errors.confirmPassword?.message}
                  margin="normal"
                  disabled={signupMutation.isPending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputLabel-root': { color: '#67748e' },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={signupMutation.isPending}
                  sx={{ 
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#42424a',
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#3a3a40',
                    },
                    '&:disabled': {
                      backgroundColor: '#42424a',
                      opacity: 0.6,
                    }
                  }}
                >
                  {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  Already have an account?{' '}
                  <MuiLink
                    href="/login"
                    sx={{
                      color: '#fff',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#f0f0f0',
                      },
                    }}
                  >
                    Sign in here
                  </MuiLink>
                </Typography>
            </Box>
        </AuthenticationCard>
        </Box>
      </Container>
    </LoginBackground>
  );
}