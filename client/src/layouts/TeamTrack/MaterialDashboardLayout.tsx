import React from 'react';
import { Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  TrackChanges as TargetIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
  Star as StarIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const navigationItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/workspace',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'CRM Module',
    icon: <PeopleIcon />,
    path: '/workspace/crm',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Assessments',
    icon: <AssessmentIcon />,
    path: '/workspace/assessments',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Virtual Data Room',
    icon: <AssignmentIcon />,
    path: '/workspace/vdr',
    roles: ['admin', 'manager']
  },
  {
    text: 'Team Management',
    icon: <TargetIcon />,
    path: '/workspace/team',
    roles: ['admin', 'manager']
  },
  {
    text: 'Lead Pipeline',
    icon: <StarIcon />,
    path: '/workspace/leads',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Reports & Analytics',
    icon: <NotificationsIcon />,
    path: '/workspace/reports',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Admin Settings',
    icon: <SettingsIcon />,
    path: '/workspace/admin',
    roles: ['admin']
  }
];

export const MaterialDashboardLayout: React.FC<MaterialDashboardLayoutProps> = ({ children }) => {
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
        background: 'linear-gradient(195deg, var(--primary-navy), var(--secondary-teal))',
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Apple Bites
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          M&A Workspace
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {navigationItems.map((item) => {
          const isActive = location === item.path;

          return (
            <Link key={item.text} href={item.path}>
              <ListItem 
                component="div"
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(68, 147, 222, 0.3)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(68, 147, 222, 0.15)',
                  },
                  cursor: 'pointer',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                }}
                data-testid={`nav-item-${item.text.toLowerCase().replace(' ', '-')}`}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 40 
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
              backgroundColor: 'rgba(68, 147, 222, 0.15)',
            },
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 'auto'
          }}
          data-testid="nav-item-logout"
        >
          <ListItemIcon sx={{ 
            color: 'inherit',
            minWidth: 40 
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
            background: 'linear-gradient(195deg, var(--primary-navy), var(--secondary-teal))',
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
            background: 'linear-gradient(195deg, var(--primary-navy), var(--secondary-teal))',
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
          backgroundColor: 'var(--background-default)',
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
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'var(--text-primary)' }}>
              Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'admin'}
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

export default MaterialDashboardLayout;