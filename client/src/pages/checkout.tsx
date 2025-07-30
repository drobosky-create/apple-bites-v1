import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Typography, Card, CardContent, Alert, CircularProgress, TextField, Button } from '@mui/material';
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
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Get product from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product') || '';
  
  // Define tier and amount outside useEffect so they're accessible in JSX
  const tier = 'growth';
  const baseAmount = 79500; // $795.00 in cents
  const finalAmount = baseAmount - discount;

  // Function to apply coupon using Stripe
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await apiRequest('POST', '/api/validate-coupon', { 
        couponCode: couponCode.trim()
      });
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const stripeCoupon = data.coupon;
        let discountAmount = 0;
        
        // Calculate discount based on Stripe coupon type
        if (stripeCoupon.percent_off) {
          discountAmount = Math.round(baseAmount * (stripeCoupon.percent_off / 100));
        } else if (stripeCoupon.amount_off) {
          discountAmount = stripeCoupon.amount_off;
        }
        
        setDiscount(discountAmount);
        setAppliedCoupon(couponCode.trim());
        setCouponApplied(true);
        setCouponCode('');
        setError(''); // Clear any previous errors
        
        // Recreate payment intent with coupon - don't do this immediately, 
        // let user see the discount first, then recreate on next page load
      } else {
        setError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setError('Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
    setCouponApplied(false);
    setError('');
  };

  // Function to recreate payment intent with or without coupon
  const recreatePaymentIntentWithCoupon = async (couponId: string | null) => {
    try {
      const response = await apiRequest('POST', '/api/create-payment-intent-fixed', { 
        productId,
        tier,
        amount: finalAmount,
        couponId
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      console.error('Failed to recreate payment intent:', err);
    }
  };

  // Function to redirect to Stripe Checkout
  const redirectToStripeCheckout = async () => {
    if (!productId) {
      setError('No product specified');
      return;
    }

    // Get the price ID based on product
    const priceIds = {
      'prod_Sddbk2RWzr8kyL': 'price_1RgqQ0AYDUS7LgRZqF6z4RzZ', // Growth & Exit Assessment
      'prod_SdvnfSZARwzdtm': 'price_1RgtSbAYDUS7LgRZwm8Zg4gE', // Basic Assessment  
      'prod_Sdvq23217qaGhp': 'price_1RgtT5AYDUS7LgRZcYpN8xEd', // Capital Market Plan
    };

    const priceId = priceIds[productId as keyof typeof priceIds];
    if (!priceId) {
      setError('Invalid product selection');
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest('POST', '/api/create-checkout-session', { 
        productId,
        tier,
        priceId,
        couponId: appliedCoupon || null,
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout session error:', err);
      setError('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No need to create payment intent upfront with prebuilt checkout
    setLoading(false);
  }, []);

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

          {/* Pricing Section */}
          <MDBox mb={4}>
            <MDTypography variant="h6" gutterBottom>
              Order Summary:
            </MDTypography>
            <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <MDTypography variant="body2">
                  Growth & Exit Assessment
                </MDTypography>
                <MDTypography variant="body2">
                  ${(baseAmount / 100).toFixed(2)}
                </MDTypography>
              </Box>
              {couponApplied && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <MDTypography variant="body2" color="success">
                    Coupon ({appliedCoupon})
                    <Button 
                      size="small" 
                      onClick={removeCoupon}
                      sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                    >
                      ×
                    </Button>
                  </MDTypography>
                  <MDTypography variant="body2" color="success">
                    -${(discount / 100).toFixed(2)}
                  </MDTypography>
                </Box>
              )}
              <Box sx={{ borderTop: '1px solid #E5E7EB', pt: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <MDTypography variant="h6">
                    Total
                  </MDTypography>
                  <MDTypography variant="h6">
                    ${(finalAmount / 100).toFixed(2)}
                  </MDTypography>
                </Box>
              </Box>
            </Box>
          </MDBox>

          {/* Coupon Field */}
          {!couponApplied && (
            <MDBox mb={4}>
              <MDTypography variant="body2" gutterBottom>
                Have a coupon code?
              </MDTypography>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                />
                <Button 
                  variant="outlined"
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                >
                  Apply
                </Button>
              </Box>
            </MDBox>
          )}

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

          {/* Official Stripe Checkout Form */}
          <form action="/api/create-checkout-session" method="POST">
            <input type="hidden" name="lookup_key" value={
              productId === 'prod_Sddbk2RWzr8kyL' ? 'growth_exit_assessment' :
              productId === 'prod_SdvnfSZARwzdtm' ? 'basic_assessment' :
              productId === 'prod_Sdvq23217qaGhp' ? 'capital_market_plan' : 'growth_exit_assessment'
            } />
            {appliedCoupon && (
              <input type="hidden" name="couponId" value={appliedCoupon} />
            )}
            
            <MDBox sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #0A1F44 30%, #1B2C4F 90%)',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Processing...' : `Complete Purchase - $${finalAmount.toFixed(2)}`}
              </MDButton>
            </MDBox>
          </form>
        </CardContent>
      </CheckoutCard>
    </CheckoutContainer>
  );
}