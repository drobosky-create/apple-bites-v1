import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { MDBox, MDTypography } from "@/components/MD";

const CheckoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CheckoutCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
}));

// Load Stripe.js
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get product from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product') || 'prod_Sddbk2RWzr8kyL'; // Default to Growth assessment
  
  // Fetch client secret from server
  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, get the current price for this product
      const productsResponse = await apiRequest('GET', '/api/stripe/products');
      const productsData = await productsResponse.json();
      
      const product = productsData.products.find((p: any) => p.id === productId);
      if (!product || !product.price) {
        throw new Error(`Product ${productId} not found or has no active price`);
      }

      // Create checkout session with embedded UI
      const sessionResponse = await apiRequest('POST', '/api/create-checkout-session', {
        priceId: product.price.id
      });
      
      const sessionData = await sessionResponse.json();
      
      if (sessionData.clientSecret) {
        setClientSecret(sessionData.clientSecret);
      } else {
        throw new Error('Failed to get client secret from server');
      }
      
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  if (loading) {
    return (
      <CheckoutContainer>
        <CheckoutCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ color: '#0A1F44', mb: 3 }} />
            <MDTypography variant="h5" color="dark">
              Setting up secure checkout...
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ mt: 1 }}>
              Please wait while we prepare your payment form
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
          <CardContent sx={{ py: 6 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <MDBox textAlign="center">
              <MDTypography variant="h5" color="dark" gutterBottom>
                Unable to load checkout
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Please refresh the page or contact support if the problem persists.
              </MDTypography>
            </MDBox>
          </CardContent>
        </CheckoutCard>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutCard>
        <CardContent sx={{ p: 0 }}>
          <MDBox p={3} textAlign="center" sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
            <MDTypography variant="h4" color="dark" gutterBottom>
              Secure Checkout
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Complete your purchase with Stripe's secure payment system
            </MDTypography>
            <Alert severity="info" sx={{ mt: 2, bgcolor: '#EBF8FF', color: '#1E3A8A', border: '1px solid #93C5FD' }}>
              <MDTypography variant="body2">
                💡 <strong>Have a promotion code?</strong> You can enter it in the form below.
              </MDTypography>
            </Alert>
          </MDBox>
          
          <MDBox p={2}>
            {clientSecret && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </MDBox>
        </CardContent>
      </CheckoutCard>
    </CheckoutContainer>
  );
}