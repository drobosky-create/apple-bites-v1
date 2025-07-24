/**
 * Material Dashboard 2 Wrapper
 * Provides the authentic Material Dashboard theme and styling
 */

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Material Dashboard 2 theme
import materialTheme from '@/assets/theme';

interface MaterialWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function MaterialWrapper({ children }: MaterialWrapperProps) {
  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}