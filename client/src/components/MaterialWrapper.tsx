/**
 * Material UI Wrapper with NextJS Styling
 * Provides a simplified way to use Material UI components with Argon styling
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e72e4',
    },
    secondary: {
      main: '#8392ab',
    },
    info: {
      main: '#11cdef',
    },
    success: {
      main: '#2dce89',
    },
    warning: {
      main: '#fb6340',
    },
    error: {
      main: '#f5365c',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#344767',
      secondary: '#67748e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#344767',
    },
    h2: {
      fontWeight: 700,
      color: '#344767',
    },
    h3: {
      fontWeight: 700,
      color: '#344767',
    },
    h4: {
      fontWeight: 600,
      color: '#344767',
    },
    h5: {
      fontWeight: 600,
      color: '#344767',
    },
    h6: {
      fontWeight: 600,
      color: '#344767',
    },
    body1: {
      color: '#67748e',
    },
    body2: {
      color: '#67748e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
          boxShadow: '0 4px 6px -1px rgba(94, 114, 228, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #825ee4 0%, #5e72e4 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 10px -1px rgba(94, 114, 228, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

interface MaterialWrapperProps {
  children: React.ReactNode;
}

const MaterialWrapper: React.FC<MaterialWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MaterialWrapper;