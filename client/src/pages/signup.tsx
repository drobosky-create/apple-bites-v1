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

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: '100%',
  margin: '0 16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3), 0 16px 32px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  zIndex: 1,
  overflow: 'visible',
}));

const FloatingHeader = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  padding: '24px',
  margin: '-48px auto 32px auto',
  width: '90%',
  maxWidth: '300px',
  textAlign: 'center',
  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  zIndex: 2,
  transform: 'scale(1.15)',
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
        <LoginCard>
          <FloatingHeader>
            <Box component="img"
              src={appleBitesLogo}
              alt="Apple Bites"
              sx={{
                width: '120px',
                height: 'auto',
                mb: 2,
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                mt: 1,
              }}
            >
              Join Apple Bites Business Assessment
            </Typography>
          </FloatingHeader>

          <CardContent sx={{ p: 4, pt: 2 }}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...form.register("firstName")}
                  error={!!form.formState.errors.firstName}
                  helperText={form.formState.errors.firstName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  {...form.register("lastName")}
                  error={!!form.formState.errors.lastName}
                  helperText={form.formState.errors.lastName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                {...form.register("email")}
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...form.register("password")}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...form.register("confirmPassword")}
                error={!!form.formState.errors.confirmPassword}
                helperText={form.formState.errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />

              <SignUpButton
                type="submit"
                fullWidth
                size="large"
                disabled={signupMutation.isPending}
                startIcon={<PersonAdd />}
              >
                {signupMutation.isPending ? "Creating Account..." : "Create Account"}
              </SignUpButton>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Already have an account?{' '}
                  <MuiLink
                    href="/login"
                    sx={{
                      color: '#0b2147',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in here
                  </MuiLink>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </LoginCard>
      </Container>
    </LoginBackground>
  );
}