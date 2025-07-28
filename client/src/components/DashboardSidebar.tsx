import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer
} from '@mui/material';
import { 
  Home, 
  FileText, 
  TrendingUp, 
  ExternalLink, 
  LogOut, 
  User,
  Calculator,
  Clock
} from "lucide-react";

const drawerWidth = 280;

interface DashboardSidebarProps {
  currentPage?: 'dashboard' | 'past-assessments' | 'value-calculator' | 'assessment-results' | 'profile';
}

export default function DashboardSidebar({ currentPage = 'dashboard' }: DashboardSidebarProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Demo user for display purposes  
  const displayUser = (user as any) || {
    firstName: "Demo",
    lastName: "User", 
    email: "demo@applebites.ai",
    tier: "free"
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return { name: 'Growth Plan', color: '#00BFA6' };
      case 'capital':
        return { name: 'Capital Plan', color: '#FF6B35' };
      default:
        return { name: 'Free Plan', color: '#64B5F6' };
    }
  };

  const tierInfo = getTierInfo(displayUser?.tier || 'free');

  const navigationItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={18} />,
      path: '/dashboard'
    },
    {
      key: 'past-assessments', 
      label: 'Past Assessments',
      icon: <Clock size={18} />,
      path: '/past-assessments'
    },
    {
      key: 'value-calculator',
      label: 'Value Calculator', 
      icon: <Calculator size={18} />,
      path: '/value-calculator'
    }
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    try {
      // Handle logout
      setLocation('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'fixed',
          top: '24px',
          left: '24px',
          height: 'calc(100vh - 48px)',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          '& > *': {
            position: 'relative',
            zIndex: 2,
          },
        },
      }}
    >
      {/* User Profile Section */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Box 
          component="img"
          src="/assets/logos/apple-bites-logo-variant-3.png"
          alt="Apple Bites Business Assessment"
          sx={{
            width: '80%',
            maxWidth: 200,
            mt: 1,
            mb: 1,
            mx: 'auto',
            display: 'block',
          }}
        />
        <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
          {displayUser?.firstName} {displayUser?.lastName}
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
          {displayUser?.email}
        </Typography>
        <Chip 
          label={tierInfo.name}
          size="small"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '0.75rem',
            mt: 1
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 2 }} />

      {/* Navigation Items */}
      <List sx={{ px: 2, flex: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                backgroundColor: currentPage === item.key ? 'rgba(0, 191, 166, 0.2)' : 'transparent',
                border: currentPage === item.key ? '1px solid rgba(0, 191, 166, 0.4)' : '1px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                color: currentPage === item.key ? '#00BFA6' : '#dbdce1'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: currentPage === item.key ? 600 : 400,
                    fontSize: '0.95rem'
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          onClick={() => setLocation('/profile')}
          sx={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#dbdce1',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.5,
            justifyContent: 'flex-start',
            mb: 1
          }}
          startIcon={<User size={18} />}
        >
          Profile
        </Button>

        <Button
          onClick={handleLogout}
          sx={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#dbdce1',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.5,
            justifyContent: 'flex-start'
          }}
          startIcon={<LogOut size={18} />}
        >
          Logout
        </Button>
      </Box>

      {/* Apple Bites Footer */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Typography variant="caption" color="rgba(255,255,255,0.6)" textAlign="center" display="block">
          © 2025 Apple Bites
        </Typography>
      </Box>
    </Drawer>
  );
}