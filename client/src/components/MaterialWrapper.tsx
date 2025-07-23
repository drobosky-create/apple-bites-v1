/**
 * Material Dashboard 2 Wrapper
 * Provides the authentic Material Dashboard theme and styling
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Simple fallback theme to prevent crashes
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#5e72e4',
    },
    secondary: {
      main: '#8392ab',
    },
  },
});

interface MaterialWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function MaterialWrapper({ children, ...props }: MaterialWrapperProps) {
  return (
    <ThemeProvider theme={defaultTheme} {...props}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}