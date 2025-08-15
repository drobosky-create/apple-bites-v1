import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Alert, CircularProgress, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { apiRequest } from "@/lib/queryClient";
import { MDBox, MDTypography, MDButton } from "@/components/MD";

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

// This component handles the redirect to Stripe Checkout

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Get product from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier') || 'growth';
  const priceId = urlParams.get('priceId') || '';
  const productId = urlParams.get('product') || '';
  
  // Define tier and amount - fetch dynamically from Stripe API only
  const [priceDetails, setPriceDetails] = useState<{amount: number; name: string; priceId: string} | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const baseAmount = priceDetails?.amount || 0; // No fallback - must come from Stripe
  const finalAmount = Math.max(0, baseAmount - discount);

  // Fetch price details from Stripe - handle both priceId and productId (no fallbacks)
  useEffect(() => {
    const fetchPriceDetails = async () => {
      setIsLoadingPrice(true);
      try {
        if (priceId) {
          // Direct price ID provided
          const response = await apiRequest('GET', `/api/stripe/price/${priceId}`);
          const data = await response.json();
          setPriceDetails({ 
            amount: data.unit_amount, 
            name: data.nickname || tier,
            priceId: data.id
          });
        } else if (productId) {
          // Product ID provided - get current active price from Stripe
          const response = await apiRequest('GET', `/api/stripe/products`);
          const data = await response.json();
          const product = data.products.find((p: any) => p.id === productId);
          
          if (product && product.price) {
            setPriceDetails({
              amount: product.price.amount,
              name: product.name,
              priceId: product.price.id
            });
          } else {
            throw new Error(`Product ${productId} not found or has no active price`);
          }
        } else {
          // No specific ID - find Growth & Exit Assessment from Stripe
          const response = await apiRequest('GET', `/api/stripe/products`);
          const data = await response.json();
          const growthProduct = data.products.find((p: any) => 
            p.name?.toLowerCase().includes('growth') && p.price
          );
          
          if (growthProduct && growthProduct.price) {
            setPriceDetails({
              amount: growthProduct.price.amount,
              name: growthProduct.name,
              priceId: growthProduct.price.id
            });
          } else {
            throw new Error('No Growth & Exit Assessment product found with active pricing');
          }
        }
      } catch (error) {
        console.error('Failed to fetch price details:', error);
        setError('Unable to load pricing information. Please try again or contact support.');
      } finally {
        setIsLoadingPrice(false);
      }
    };
    
    fetchPriceDetails();
  }, [priceId, productId, tier]);

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

  // Dummy function - we'll use a real HTML form instead
  const redirectToStripeCheckout = () => {
    setLoading(true);
  };

  useEffect(() => {
    // Don't auto-redirect if user is applying a coupon
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

  if (loading || isLoadingPrice) {
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
                  {priceDetails?.name || 'Growth & Exit Assessment'}
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

          {/* Checkout Form - Direct HTML form submission */}
          <MDBox sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <form 
              method="POST" 
              action="/api/create-checkout-session"
              style={{ width: '100%' }}
            >
              <input type="hidden" name="priceId" value={priceDetails?.priceId || ''} />
              {appliedCoupon && (
                <input type="hidden" name="couponId" value={appliedCoupon} />
              )}
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
                {loading ? 'Redirecting to Stripe...' : `Complete Purchase - $${(finalAmount / 100).toFixed(2)}`}
              </MDButton>
            </form>
          </MDBox>
        </CardContent>
      </CheckoutCard>
    </CheckoutContainer>
  );
}