import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Chip } from "@mui/material";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  title?: string;
}

const SIDEBAR_WIDTH = 280;

export default function DashboardLayout({ 
  children, 
  sidebarItems, 
  activeSection, 
  setActiveSection, 
  title = "Dashboard" 
}: DashboardLayoutProps) {
  
  // If no sidebar items provided, render simple layout
  if (!sidebarItems || !setActiveSection) {
    return (
      <Box
        sx={{
          p: 3,
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1a1d29',
            color: 'white',
            borderRight: 'none',
          },
        }}
      >
        <MDBox p={3} borderBottom="1px solid rgba(255,255,255,0.1)">
          <MDTypography variant="h5" fontWeight="bold" color="white">
            {title}
          </MDTypography>
        </MDBox>
        
        <List sx={{ p: 2 }}>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    borderRadius: '8px',
                    bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: 'white !important',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                    py: 1.5,
                    '& .MuiListItemText-primary': {
                      color: 'white !important',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white !important',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                    <IconComponent size={20} color="white" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      color: 'white',
                    }}
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#4ade80', 
                        color: 'white',
                        fontSize: '10px',
                        height: '20px',
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f8f9fa',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}