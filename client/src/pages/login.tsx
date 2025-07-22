import { useState } from "react";
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
  IconButton,
} from '@mui/material';
import { Facebook, GitHub, Google, Apple, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components matching the Material UI design
const Background = styled(Box)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(310deg, #7928ca, #ff0080)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}));

const SignInCard = styled(Card)(() => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: 16,
  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}));

const DarkHeader = styled(Box)(() => ({
  background: '#344767',
  color: 'white',
  padding: '32px',
  textAlign: 'center',
}));

const SocialButton = styled(IconButton)(() => ({
  color: 'white',
  margin: '0 4px',
  padding: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const FormContainer = styled(CardContent)(() => ({
  padding: '32px',
  backgroundColor: 'white',
}));

const StyledTextField = styled(TextField)(() => ({
  marginBottom: '24px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

const SignInButton = styled(Button)(() => ({
  backgroundColor: '#344767',
  color: 'white',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: '#2c3e50',
  },
  '&:disabled': {
    backgroundColor: '#a0aec0',
  },
}));

export default function Login() {
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
      const response = await fetch("/api/auth/custom-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <Background>
      <SignInCard>
        {/* Dark Header with Social Login Buttons */}
        <DarkHeader>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 300 }}>
            Sign in
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <SocialButton onClick={() => handleSocialLogin('facebook')}>
              <Facebook />
            </SocialButton>
            <SocialButton onClick={() => handleSocialLogin('github')}>
              <GitHub />
            </SocialButton>
            <SocialButton onClick={() => handleSocialLogin('google')}>
              <Google />
            </SocialButton>
            <SocialButton onClick={() => handleSocialLogin('apple')}>
              <Apple />
            </SocialButton>
            <SocialButton onClick={() => handleSocialLogin('email')}>
              <Email />
            </SocialButton>
          </Box>
        </DarkHeader>

        {/* White Form Container */}
        <FormContainer>
          <form onSubmit={handleLogin}>
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
              disabled={isLoading}
            />

            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
              disabled={isLoading}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ ml: 1 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#67748e' }}>
                  Remember me
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            <SignInButton
              type="submit"
              fullWidth
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </SignInButton>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
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
          </form>
        </FormContainer>
      </SignInCard>
    </Background>
  );
}