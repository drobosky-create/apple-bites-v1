import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography 
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import { useLocation } from "wouter";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Free Assessment", icon: <AssessmentIcon />, path: "/assessment/free" },
  { text: "Growth Assessment", icon: <TrendingUpIcon />, path: "/assessment/paid" },
  { text: "Value Calculator", icon: <AnalyticsIcon />, path: "/value-calculator" },
  { text: "Team Management", icon: <PeopleIcon />, path: "/team" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0b2147',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Apple Bites
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#81e5d8',
                  color: '#0b2147',
                  '&:hover': {
                    backgroundColor: '#81e5d8',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(129, 229, 216, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}