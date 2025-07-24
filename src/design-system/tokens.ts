/**
 * Design Tokens - Single Source of Truth
 * Change colors here to update entire application
 */

export const tokens = {
  colors: {
    // Apple Bites Brand Colors
    primary: {
      50: '#e8f5e8',
      100: '#c8e6c9',
      500: '#4caf50',  // Apple Green - Main brand color
      600: '#43a047',
      700: '#388e3c',
      900: '#1b5e20',
    },
    
    // Navy for professional elements
    navy: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#0b2147',  // Apple Bites Navy
      600: '#1565c0',
      700: '#0d47a1',
    },
    
    // Status colors
    success: { 500: '#4caf50', 600: '#43a047' },
    warning: { 500: '#ff9800', 600: '#f57c00' },
    error: { 500: '#f44336', 600: '#d32f2f' },
    
    // Neutral colors
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      500: '#9e9e9e',
      700: '#616161',
      900: '#212121',
    },
    
    // Semantic colors
    background: '#fafafa',
    surface: '#ffffff',
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  
  borderRadius: {
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }
};