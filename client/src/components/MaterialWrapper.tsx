/**
 * Material Dashboard 2 Wrapper
 * Provides Material Dashboard theme integration with MUI
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { materialDashboardTheme } from '@/theme/materialDashboard';

interface MaterialWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

// Create Material Dashboard enhanced MUI theme
const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8',
      dark: '#1662C4',
    },
    secondary: {
      main: '#7b1fa2',
      dark: '#6a1b9a',
    },
    info: {
      main: '#1A73E8',
      dark: '#1662C4',
    },
    success: {
      main: '#4CAF50',
      dark: '#43A047',
    },
    warning: {
      main: '#fb8c00',
      dark: '#f57c00',
    },
    error: {
      main: '#F44335',
      dark: '#D32F2F',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#344767',
      secondary: '#67748e',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    // Material Dashboard specific palette extensions
    white: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 12,
  },
  // Inject Material Dashboard custom properties
  gradients: materialDashboardTheme.gradients,
  boxShadows: materialDashboardTheme.boxShadows,
  borders: materialDashboardTheme.borders,
  functions: materialDashboardTheme.functions,
} as any);

export default function MaterialWrapper({ children }: MaterialWrapperProps) {
  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}