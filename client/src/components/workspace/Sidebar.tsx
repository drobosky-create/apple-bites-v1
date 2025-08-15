import React from 'react';
import { useLocation } from 'wouter';
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { Dashboard, Assignment, People, Assessment } from '@mui/icons-material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';

const sidebarItems = [
  { 
    to: '/workspace/crm', 
    label: 'CRM', 
    icon: Dashboard,
    roles: ['analyst', 'manager', 'admin'] 
  },
  { 
    to: '/workspace/vdr', 
    label: 'VDR', 
    icon: Assignment,
    roles: ['manager', 'admin'] 
  },
  { 
    to: '/workspace/team', 
    label: 'Team', 
    icon: People,
    roles: ['admin'] 
  },
  { 
    to: '/workspace/assessments', 
    label: 'Assessments', 
    icon: Assessment,
    roles: ['analyst', 'manager', 'admin'] 
  },
];

interface WorkspaceSidebarProps {
  userRole?: string;
}

export default function WorkspaceSidebar({ userRole = 'admin' }: WorkspaceSidebarProps) {
  const [location, setLocation] = useLocation();

  const visibleItems = sidebarItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: 240,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderRightColor: 'divider',
        }
      }}
    >
      <MDBox p={2} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <MDTypography variant="h6" fontWeight="bold" color="text">
          Internal Workspace
        </MDTypography>
        <MDTypography variant="caption" color="text.secondary">
          Meritage Partners
        </MDTypography>
      </MDBox>
      
      <List sx={{ pt: 1 }}>
        {visibleItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.startsWith(item.to);
          
          return (
            <ListItemButton
              key={item.to}
              onClick={() => setLocation(item.to)}
              sx={{
                mx: 1,
                borderRadius: 1,
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <IconComponent fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}