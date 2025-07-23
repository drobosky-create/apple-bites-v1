import InteractiveValuationSlider from "@/components/interactive-valuation-slider";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Home, Calculator, BarChart3, Settings, HelpCircle, TrendingUp } from "lucide-react";
import type { ValuationAssessment } from "@shared/schema";
import { Box, Drawer, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Components with Material Dashboard Theme
const MainBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
});

const SidebarDrawer = styled(Drawer)({
  width: 280,
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0 20px 20px 0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
});

const NavItem = styled(Box)<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  margin: '4px 12px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(4px)',
  },
}));

const MainContent = styled(Box)({
  marginLeft: 280,
  padding: '32px',
  position: 'relative',
  zIndex: 1,
});

const GlassCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '& .MuiCardContent-root': {
    padding: '32px',
  },
});

const PageHeader = styled(Box)({
  marginBottom: '32px',
});

export default function ValueCalculator() {
  const [, setLocation] = useLocation();
  
  // Check if user has completed at least one assessment
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
  });

  const hasCompletedAssessment = assessments && assessments.length > 0;

  useEffect(() => {
    // If no assessments and not loading, redirect to valuation form
    if (!isLoading && !hasCompletedAssessment) {
      setLocation('/valuation-form');
    }
  }, [isLoading, hasCompletedAssessment, setLocation]);

  // Navigation items
  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/', active: false },
    { icon: Calculator, label: 'Assessment', path: '/assessment/free', active: false },
    { icon: TrendingUp, label: 'Value Calculator', path: '/value-calculator', active: true },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', active: false },
    { icon: Settings, label: 'Settings', path: '/settings', active: false },
    { icon: HelpCircle, label: 'Help', path: '/help', active: false },
  ];

  if (isLoading) {
    return (
      <MainBackground>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh' 
        }}>
          <GlassCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
                Loading your data...
              </Typography>
            </CardContent>
          </GlassCard>
        </Box>
      </MainBackground>
    );
  }

  // Show access denied if no assessments found
  if (!hasCompletedAssessment) {
    return (
      <MainBackground>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          padding: 3 
        }}>
          <GlassCard sx={{ maxWidth: 400, width: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Lock size={64} color="rgba(255,255,255,0.7)" style={{ marginBottom: 16 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Assessment Required
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                You need to complete a business valuation assessment before accessing the value improvement calculator.
              </Typography>
              <Button 
                onClick={() => setLocation('/valuation-form')}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Valuation Assessment
              </Button>
            </CardContent>
          </GlassCard>
        </Box>
      </MainBackground>
    );
  }

  return (
    <MainBackground>
      {/* Sidebar Navigation */}
      <SidebarDrawer variant="permanent" anchor="left">
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo/Brand Section */}
          <Box sx={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              fontWeight: 700,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #fff 30%, #e0e7ff 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Apple Bites
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flex: 1, paddingTop: 2 }}>
            {navigationItems.map((item) => (
              <NavItem 
                key={item.path}
                active={item.active}
                onClick={() => !item.active && setLocation(item.path)}
              >
                <item.icon size={20} color="white" />
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: item.active ? 600 : 400 
                }}>
                  {item.label}
                </Typography>
              </NavItem>
            ))}
          </Box>

          {/* Footer */}
          <Box sx={{ padding: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="caption" sx={{ 
              color: 'rgba(255,255,255,0.6)', 
              textAlign: 'center',
              display: 'block'
            }}>
              © 2025 Meritage Partners
            </Typography>
          </Box>
        </Box>
      </SidebarDrawer>

      {/* Main Content */}
      <MainContent>
        {/* Page Header */}
        <PageHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ 
                color: 'white', 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Value Improvement Calculator
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: 400,
                mt: 1
              }}>
                Explore how improving your operational grades affects your business valuation
              </Typography>
            </Box>
            <Button
              onClick={() => setLocation('/assessment/free')}
              className="bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment
            </Button>
          </Box>
        </PageHeader>

        {/* Main Calculator Container */}
        <GlassCard>
          <CardContent>
            <InteractiveValuationSlider />
          </CardContent>
        </GlassCard>
      </MainContent>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </MainBackground>
  );
}