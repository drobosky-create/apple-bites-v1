import React from 'react';
import { Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  AccountBalance as AccountBalanceIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  AccountTree as AccountTreeIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface EnhancedMaterialDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const navigationItems = [
  {
    text: 'Enhanced Dashboard',
    icon: <DashboardIcon />,
    path: '/enhanced-dashboard',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Free Assessment',
    icon: <AssessmentIcon />,
    path: '/assessment/free',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Growth & Exit Assessment',
    icon: <TrendingUpIcon />,
    path: '/assessment/paid',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Value Calculator',
    icon: <CalculateIcon />,
    path: '/value-calculator',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Analytics Dashboard',
    icon: <AnalyticsIcon />,
    path: '/admin/analytics',
    roles: ['admin', 'manager']
  },
  {
    text: 'Leads & Assessments',
    icon: <PeopleIcon />,
    path: '/admin/leads',
    roles: ['admin', 'manager']
  },
  {
    text: 'CRM Dashboard',
    icon: <BusinessIcon />,
    path: '/admin/crm',
    roles: ['admin', 'manager']
  },
  {
    text: 'Deal Pipeline',
    icon: <AccountTreeIcon />,
    path: '/admin/deal-pipeline',
    roles: ['admin', 'manager']
  },
  {
    text: 'CRM Pipeline',
    icon: <BusinessIcon />,
    path: '/admin/crm-pipeline',
    roles: ['admin', 'manager']
  },
  {
    text: 'Team Management',
    icon: <PeopleIcon />,
    path: '/admin/team',
    roles: ['admin']
  },
  {
    text: 'Profile',
    icon: <PersonIcon />,
    path: '/profile',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Past Assessments',
    icon: <HistoryIcon />,
    path: '/past-assessments',
    roles: ['admin', 'manager', 'team_member']
  }
];

export const EnhancedMaterialDashboardLayout: React.FC<EnhancedMaterialDashboardLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const drawer = (
    <Box>
      <Box sx={{
        p: 3,
        background: 'linear-gradient(195deg, #0b2147, #07152E)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Apple Bites
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          M&A Business Platform
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {navigationItems.map((item) => {
          const isActive = location === item.path;
          const hasAccess = item.roles.includes((user as any)?.role || 'team_member');

          if (!hasAccess) return null;

          return (
            <Link key={item.text} href={item.path}>
              <ListItem
                component="div"
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  cursor: 'pointer',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                }}
                data-testid={`nav-item-${item.text.toLowerCase().replace(' ', '-')}`}
              >
                <ListItemIcon sx={{
                  color: '#ffffff',
                  minWidth: 40,
                  '& svg': {
                    color: '#ffffff'
                  }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItem>
            </Link>
          );
        })}

        {/* Logout */}
        <ListItem
          onClick={() => window.location.href = '/api/logout'}
          sx={{
            mx: 2,
            my: 0.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 'auto'
          }}
          data-testid="nav-item-logout"
        >
          <ListItemIcon sx={{
            color: '#ffffff',
            minWidth: 40,
            '& svg': {
              color: '#ffffff'
            }
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.875rem',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(195deg, #005b8c, #004662)',
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(195deg, #005b8c, #004662)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        {/* Top Navigation */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                '& svg': {
                  color: '#344767'
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#344767' }}>
              Welcome back, {(user as any)?.firstName || (user as any)?.email?.split('@')[0]}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 4, ml: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};