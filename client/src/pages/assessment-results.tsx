import React from "react";
import { Container } from '@mui/material';
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { ArrowLeft } from "lucide-react";
import ValuationResults from "@/components/valuation-results";
import type { ValuationAssessment } from "@shared/schema";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Box,
  Typography,
  Button
} from '@mui/material';

const drawerWidth = 280;

export default function AssessmentResults() {
  const [, params] = useRoute("/assessment-results/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: assessment, isLoading, error } = useQuery<ValuationAssessment>({
    queryKey: [`/api/assessment/${params?.id}`],
    enabled: !!params?.id,
  });

  // Demo user for display purposes
  const displayUser = user || {
    firstName: "Demo",
    lastName: "User", 
    email: "demo@applebites.ai",
    tier: "free"
  };

  if (isLoading) {
    return (
      <DashboardLayout currentPage="assessment-results">
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            p: 4,
            minHeight: 'calc(100vh - 48px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading assessment...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !assessment) {
    return (
      <DashboardLayout currentPage="assessment-results">
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            p: 4,
            minHeight: 'calc(100vh - 48px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Assessment not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => setLocation('/dashboard')}
            startIcon={<ArrowLeft size={18} />}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="assessment-results">
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            p: 4,
            minHeight: 'calc(100vh - 48px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setLocation('/dashboard')}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                borderColor: '#0A1F44',
                color: '#0A1F44',
                '&:hover': {
                  borderColor: '#00BFA6',
                  backgroundColor: 'rgba(0, 191, 166, 0.04)'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <ValuationResults results={assessment} />
        </Box>
      </Container>
    </DashboardLayout>
  );
}