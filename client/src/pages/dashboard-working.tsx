import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { TrendingUp, Assessment, AccountCircle } from '@mui/icons-material';

export default function WorkingDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mock user data for demonstration
  const userData = {
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User", 
    email: user?.email || "demo@example.com",
    tier: user?.tier || "free"
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#344767', mb: 1 }}>
          Welcome to Apple Bites
        </Typography>
        <Typography variant="body1" sx={{ color: '#67748e' }}>
          Professional business valuations powered by AI
        </Typography>
      </Box>

      {/* User Profile and Assessment Actions */}
      <Box display="flex" gap={3} mb={4} flexWrap="wrap">
        {/* User Profile Card */}
        <Card sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                <AccountCircle fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, color: '#344767' }}>
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#67748e' }}>
                  {userData.email}
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label={`${userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)} Tier`}
              color={userData.tier === 'free' ? 'default' : 'primary'}
              size="small"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        {/* Assessment Actions */}
        <Card sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <TrendingUp sx={{ mr: 1, color: '#1A73E8' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#344767' }}>
                Start Your Business Assessment
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: '#67748e', mb: 3 }}>
              Get comprehensive insights into your business value with our AI-powered assessment tools.
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              {/* Material Dashboard style gradient button */}
              <Button 
                variant="contained"
                size="large"
                onClick={() => setLocation('/assessment/free')}
                startIcon={<Assessment />}
                sx={{
                  background: 'linear-gradient(195deg, #1A73E8, #1662C4)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16)',
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '12px 24px',
                  '&:hover': {
                    background: 'linear-gradient(195deg, #1A73E8, #1662C4)',
                    boxShadow: '0 4px 20px 0 rgba(26, 115, 232, 0.14)',
                    transform: 'translateY(-1px)',
                  },
                  '&:focus': {
                    background: 'linear-gradient(195deg, #1A73E8, #1662C4)',
                    boxShadow: '0 4px 20px 0 rgba(26, 115, 232, 0.14)',
                  },
                  '&:active': {
                    background: 'linear-gradient(195deg, #1A73E8, #1662C4)',
                    transform: 'translateY(0)',
                  },
                }}
              >
                Start Free Assessment
              </Button>

              <Button 
                variant="contained"
                color="success"
                onClick={() => setLocation('/value-calculator')}
                sx={{
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Value Calculator
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Dashboard Stats with Material Dashboard styling */}
      <Box display="flex" gap={3} flexWrap="wrap">
        <Card sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box 
              p={2} 
              mb={2}
              sx={{
                background: 'linear-gradient(195deg, #1A73E8, #1662C4)',
                borderRadius: '0.5rem',
                boxShadow: '0 8px 26px -4px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Assessment sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#344767' }}>
              Assessments
            </Typography>
            <Typography variant="body2" sx={{ color: '#67748e' }}>
              Complete business evaluations
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box 
              p={2} 
              mb={2}
              sx={{
                background: 'linear-gradient(195deg, #4CAF50, #43A047)',
                borderRadius: '0.5rem',
                boxShadow: '0 8px 26px -4px rgba(0, 0, 0, 0.15)',
              }}
            >
              <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#344767' }}>
              Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: '#67748e' }}>
              Track your business metrics
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}