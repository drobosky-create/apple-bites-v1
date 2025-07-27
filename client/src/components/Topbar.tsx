import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Avatar 
} from "@mui/material";
import { 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon 
} from "@mui/icons-material";

const drawerWidth = 240;

export default function Topbar() {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: `calc(100% - ${drawerWidth}px)`, 
        ml: `${drawerWidth}px`,
        backgroundColor: 'white',
        color: '#0b2147',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Business Valuation Platform
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              backgroundColor: '#81e5d8', 
              color: '#0b2147' 
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}