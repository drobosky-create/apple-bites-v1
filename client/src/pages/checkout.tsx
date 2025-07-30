import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { apiRequest } from "@/lib/queryClient";
import { MDBox, MDTypography, MDButton } from "@/components/MD";

// Load Stripe - will need VITE_STRIPE_PUBLIC_KEY
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CheckoutCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
}));

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment=success`,
      },
    });

    if (error) {
      setMessage(error.message || 'Payment failed');
    }
    
    setIsProcessing(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <MDBox mb={3}>
        <PaymentElement />
      </MDBox>
      
      {message && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      <MDButton
        type="submit"
        variant="gradient"
        color="info"
        fullWidth
        size="large"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} color="inherit" />
            <span>Processing...</span>
          </Box>
        ) : (
          'Complete Payment'
        )}
      </MDButton>
    </Box>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get tier and priceId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier') || 'growth';
  const priceId = urlParams.get('priceId') || '';

  useEffect(() => {
    // Create PaymentIntent when component loads
    apiRequest('POST', '/api/create-payment-intent', { 
      tier,
      priceId,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initialize payment');
        }
      })
      .catch((err) => {
        setError('Failed to initialize payment');
        console.error('Payment initialization error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tier, priceId]);

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <CheckoutContainer>
        <CheckoutCard>
          <CardContent>
            <Alert severity="error">
              Stripe configuration required. Please contact support.
            </Alert>
          </CardContent>
        </CheckoutCard>
      </CheckoutContainer>
    );
  }

  if (loading) {
    return (
      <CheckoutContainer>
        <CheckoutCard>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={40} />
            <MDTypography variant="h6" sx={{ mt: 2 }}>
              Initializing secure checkout...
            </MDTypography>
          </CardContent>
        </CheckoutCard>
      </CheckoutContainer>
    );
  }

  if (error) {
    return (
      <CheckoutContainer>
        <CheckoutCard>
          <CardContent>
            <Alert severity="error">{error}</Alert>
          </CardContent>
        </CheckoutCard>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <MDBox textAlign="center" mb={4}>
            <img 
              src="/apple-bites-logo.png" 
              alt="Apple Bites" 
              style={{ height: 60, marginBottom: 16 }}
            />
            <MDTypography variant="h4" fontWeight="bold" gutterBottom>
              {tier === 'growth' ? 'Growth & Exit Assessment' : 
               tier === 'capital' ? 'Capital Market Positioning Plan' : 'Assessment'}
            </MDTypography>
            <MDTypography variant="h6" color="text" sx={{ opacity: 0.7 }}>
              Secure checkout powered by Stripe
            </MDTypography>
          </MDBox>

          {/* Features */}
          <MDBox mb={4}>
            <MDTypography variant="h6" gutterBottom>
              What's included:
            </MDTypography>
            <Box component="ul" sx={{ pl: 2, color: '#6B7280' }}>
              <li>Industry-specific NAICS valuation analysis</li>
              <li>Comprehensive AI-powered business insights</li>
              <li>Professional PDF valuation report</li>
              <li>Value improvement recommendations</li>
              {tier === 'capital' && (
                <>
                  <li>Investment readiness assessment</li>
                  <li>Capital structure optimization</li>
                  <li>Access to capital readiness community</li>
                </>
              )}
            </Box>
          </MDBox>

          {/* Payment Form */}
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm />
            </Elements>
          )}
        </CardContent>
      </CheckoutCard>
    </CheckoutContainer>
  );
}