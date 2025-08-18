import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Folder as FolderIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  List as ListIcon,
  ViewKanban as KanbanIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';

const drawerWidth = 240;

const navigationItems = [
  { text: 'CRM Overview', path: '/workspace/crm', icon: <DashboardIcon /> },
  { text: 'Leads', path: '/workspace/leads', icon: <PeopleIcon /> },
  { text: 'Kanban Board', path: '/workspace/kanban', icon: <KanbanIcon /> },
  { text: 'List View', path: '/workspace/list', icon: <ListIcon /> },
  { text: 'Calendar', path: '/workspace/calendar', icon: <CalendarIcon /> },
  { text: 'Assessments', path: '/workspace/assessments', icon: <AssessmentIcon /> },
  { text: 'VDR', path: '/workspace/vdr', icon: <FolderIcon /> },
  { text: 'Team', path: '/workspace/team', icon: <PeopleIcon /> },
  { text: 'Analytics', path: '/workspace/reports', icon: <AnalyticsIcon /> },
  { text: 'Settings', path: '/workspace/settings', icon: <SettingsIcon /> },
];

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

export default function MaterialDashboardLayout({ children }: MaterialDashboardLayoutProps) {
  const [location] = useLocation();

  console.log('MOUNT: Real TeamTrack MaterialDashboardLayout with MUI Drawer');

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1976d2',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            TeamTrack Workspace
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#f5f5f5',
              borderRight: '1px solid #e0e0e0',
            },
          }}
          open
        >
          <Box sx={{ overflow: 'auto', mt: 8 }}>
            <Divider />
            <List>
              {navigationItems.map((item) => {
                const isActive = location === item.path || location.startsWith(item.path + '/');
                
                return (
                  <ListItem key={item.text} disablePadding>
                    <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
                      <ListItemButton
                        sx={{
                          backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive ? '#1976d2' : '#666',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            color: isActive ? '#1976d2' : '#333',
                            '& .MuiListItemText-primary': {
                              fontWeight: isActive ? 600 : 400,
                            },
                          }}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#fafafa',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}