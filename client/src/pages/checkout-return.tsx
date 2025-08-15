import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { MDBox, MDTypography, MDButton } from "@/components/MD";

const ReturnContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ReturnCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
}));

export default function CheckoutReturn() {
  const [status, setStatus] = useState<'loading' | 'complete' | 'open' | 'expired'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found in URL');
      return;
    }

    // Retrieve session status from server
    const fetchSessionStatus = async () => {
      try {
        const response = await apiRequest('POST', '/api/checkout-session-status', {
          sessionId
        });
        
        if (!response.ok) {
          throw new Error('Failed to retrieve session status');
        }
        
        const data = await response.json();
        setSessionData(data);
        setStatus(data.status);
        
      } catch (err: any) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Failed to retrieve payment status');
      }
    };

    fetchSessionStatus();
  }, []);

  if (status === 'loading') {
    return (
      <ReturnContainer>
        <ReturnCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ color: '#0A1F44', mb: 3 }} />
            <MDTypography variant="h5" color="dark">
              Verifying your payment...
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ mt: 1 }}>
              Please wait while we confirm your transaction
            </MDTypography>
          </CardContent>
        </ReturnCard>
      </ReturnContainer>
    );
  }

  if (error) {
    return (
      <ReturnContainer>
        <ReturnCard>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <XCircle size={80} color="#dc3545" style={{ marginBottom: 24 }} />
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <MDTypography variant="h5" color="dark" gutterBottom>
              Payment Verification Failed
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ mb: 4 }}>
              We couldn't verify your payment status. Please contact support if you believe this is an error.
            </MDTypography>
            <MDButton 
              variant="gradient" 
              color="error"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </MDButton>
          </CardContent>
        </ReturnCard>
      </ReturnContainer>
    );
  }

  if (status === 'complete') {
    return (
      <ReturnContainer>
        <ReturnCard>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <CheckCircle size={80} color="#28a745" style={{ marginBottom: 24 }} />
            <MDTypography variant="h4" color="success" gutterBottom>
              Payment Successful!
            </MDTypography>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              <MDTypography variant="body2">
                <strong>Order ID:</strong> {sessionData?.id}<br/>
                <strong>Amount:</strong> ${(sessionData?.amount_total / 100).toFixed(2)}<br/>
                <strong>Payment Method:</strong> {sessionData?.payment_method_types?.[0] || 'Card'}
              </MDTypography>
            </Alert>
            
            <MDTypography variant="body1" color="text" sx={{ mb: 4 }}>
              Your payment has been processed successfully. You'll receive a confirmation email shortly with your receipt and next steps.
            </MDTypography>
            
            <MDBox sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <MDButton 
                variant="gradient" 
                color="success"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </MDButton>
              <MDButton 
                variant="outlined" 
                color="dark"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </MDButton>
            </MDBox>
          </CardContent>
        </ReturnCard>
      </ReturnContainer>
    );
  }

  if (status === 'open') {
    return (
      <ReturnContainer>
        <ReturnCard>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <AlertCircle size={80} color="#ffc107" style={{ marginBottom: 24 }} />
            <MDTypography variant="h5" color="warning" gutterBottom>
              Payment Incomplete
            </MDTypography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Your payment was not completed. This could be due to a declined card or cancelled transaction.
            </Alert>
            
            <MDTypography variant="body1" color="text" sx={{ mb: 4 }}>
              Would you like to try again? You can return to the checkout page to complete your purchase.
            </MDTypography>
            
            <MDBox sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <MDButton 
                variant="gradient" 
                color="warning"
                onClick={() => window.location.href = '/checkout'}
              >
                Try Again
              </MDButton>
              <MDButton 
                variant="outlined" 
                color="dark"
                onClick={() => window.location.href = '/'}
              >
                Cancel
              </MDButton>
            </MDBox>
          </CardContent>
        </ReturnCard>
      </ReturnContainer>
    );
  }

  return (
    <ReturnContainer>
      <ReturnCard>
        <CardContent sx={{ py: 6, textAlign: 'center' }}>
          <AlertCircle size={80} color="#6c757d" style={{ marginBottom: 24 }} />
          <MDTypography variant="h5" color="dark" gutterBottom>
            Session Expired
          </MDTypography>
          <MDTypography variant="body1" color="text" sx={{ mb: 4 }}>
            Your checkout session has expired. Please start a new checkout process.
          </MDTypography>
          <MDButton 
            variant="gradient" 
            color="dark"
            onClick={() => window.location.href = '/pricing'}
          >
            View Pricing
          </MDButton>
        </CardContent>
      </ReturnCard>
    </ReturnContainer>
  );
}