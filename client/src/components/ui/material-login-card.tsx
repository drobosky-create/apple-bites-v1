/**
 * Material Dashboard Login Card Component
 * Styled to match the provided Material Dashboard design
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Facebook, GitHub, Google } from '@mui/icons-material';

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: 16,
  boxShadow: '0 20px 27px rgba(0, 0, 0, 0.05)',
  overflow: 'visible',
}));

const LoginHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #344767 0%, #2c3e50 100%)',
  padding: theme.spacing(4, 4, 3),
  borderRadius: '16px 16px 0 0',
  textAlign: 'center',
  position: 'relative',
  marginBottom: theme.spacing(1),
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  margin: theme.spacing(0, 1),
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
      borderColor: '#5e72e4',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#67748e',
  },
}));

const SignInButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #344767 0%, #2c3e50 100%)',
  color: '#ffffff',
  borderRadius: 12,
  padding: theme.spacing(1.5, 0),
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 6px rgba(52, 71, 103, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2c3e50 0%, #344767 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 10px rgba(52, 71, 103, 0.4)',
  },
  transition: 'all 0.3s ease',
}));

interface MaterialLoginCardProps {
  onLogin: (email: string, password: string) => void;
  onSocialLogin: (provider: 'facebook' | 'github' | 'google') => void;
  onSignUp: () => void;
  isLoading?: boolean;
}

const MaterialLoginCard: React.FC<MaterialLoginCardProps> = ({
  onLogin,
  onSocialLogin,
  onSignUp,
  isLoading = false,
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <LoginCard>
      <LoginHeader>
        <Typography variant="h5" component="h2" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
          Sign in
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <SocialButton onClick={() => onSocialLogin('facebook')} size="small">
            <Facebook fontSize="small" />
          </SocialButton>
          <SocialButton onClick={() => onSocialLogin('github')} size="small">
            <GitHub fontSize="small" />
          </SocialButton>
          <SocialButton onClick={() => onSocialLogin('google')} size="small">
            <Google fontSize="small" />
          </SocialButton>
        </Box>
      </LoginHeader>

      <CardContent sx={{ p: 4, pt: 3 }}>
        <form onSubmit={handleSubmit}>
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
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: '#67748e',
                    '&.Mui-checked': {
                      color: '#5e72e4',
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
              <Link
                component="button"
                type="button"
                onClick={onSignUp}
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
              </Link>
            </Typography>
          </Box>
        </form>
      </CardContent>
    </LoginCard>
  );
};

export default MaterialLoginCard;