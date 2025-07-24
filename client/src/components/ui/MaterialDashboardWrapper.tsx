/**
 * Material Dashboard Theme Wrapper
 * Applies Material Dashboard theme only to specific components
 */

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import materialTheme from '@/assets/theme';

interface MaterialDashboardWrapperProps {
  children: React.ReactNode;
}

export default function MaterialDashboardWrapper({ children }: MaterialDashboardWrapperProps) {
  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}