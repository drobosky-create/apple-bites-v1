/**
 * Centralized Design System
 * Single source of truth for all colors, spacing, typography, and components
 * Changes here automatically propagate throughout the entire application
 */

// ========================
// DESIGN TOKENS (Single Source of Truth)
// ========================

export const designTokens = {
  // Color System - Change these to update entire app
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff', 
      500: '#9c27b0',  // Main brand color
      600: '#8e24aa',
      700: '#7b1fa2',
      900: '#4a148c',
    },
    
    // Secondary Colors
    secondary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      600: '#1976d2',
      700: '#1565c0',
    },
    
    // Status Colors
    success: {
      50: '#e8f5e8',
      500: '#4caf50',
      600: '#43a047',
    },
    
    warning: {
      50: '#fff3e0',
      500: '#ff9800',
      600: '#fb8c00',
    },
    
    error: {
      50: '#ffebee',
      500: '#f44336',
      600: '#e53935',
    },
    
    // Neutral Colors
    gray: {
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
    
    // Semantic Colors
    background: '#fafafa',
    surface: '#ffffff',
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#bdbdbd',
    }
  },
  
  // Typography System
  typography: {
    fontFamily: {
      primary: '"Roboto", "Helvetica", "Arial", sans-serif',
      secondary: '"Inter", system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  // Spacing System (8px base grid)
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// ========================
// COMPONENT VARIANTS
// ========================

export const componentVariants = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: designTokens.colors.primary[500],
      color: '#ffffff',
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      borderRadius: designTokens.borderRadius.md,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      boxShadow: designTokens.shadows.sm,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: designTokens.colors.primary[600],
        boxShadow: designTokens.shadows.md,
        transform: 'translateY(-1px)',
      }
    },
    
    secondary: {
      backgroundColor: 'transparent',
      color: designTokens.colors.primary[500],
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      borderRadius: designTokens.borderRadius.md,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      border: `1px solid ${designTokens.colors.primary[500]}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: designTokens.colors.primary[50],
      }
    },
    
    success: {
      backgroundColor: designTokens.colors.success[500],
      color: '#ffffff',
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      borderRadius: designTokens.borderRadius.md,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      boxShadow: designTokens.shadows.sm,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: designTokens.colors.success[600],
        boxShadow: designTokens.shadows.md,
      }
    }
  },
  
  // Card Variants
  card: {
    default: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.borderRadius.lg,
      boxShadow: designTokens.shadows.base,
      padding: designTokens.spacing[6],
      border: `1px solid ${designTokens.colors.gray[200]}`,
    },
    
    elevated: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.borderRadius.lg,
      boxShadow: designTokens.shadows.lg,
      padding: designTokens.spacing[6],
      border: 'none',
    },
    
    gradient: {
      background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[700]})`,
      borderRadius: designTokens.borderRadius.lg,
      boxShadow: designTokens.shadows.lg,
      padding: designTokens.spacing[6],
      color: '#ffffff',
      border: 'none',
    }
  },
  
  // Input Variants
  input: {
    default: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      borderRadius: designTokens.borderRadius.md,
      border: `1px solid ${designTokens.colors.gray[300]}`,
      fontSize: designTokens.typography.fontSize.base,
      backgroundColor: designTokens.colors.surface,
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: designTokens.colors.primary[500],
        boxShadow: `0 0 0 3px ${designTokens.colors.primary[500]}20`,
      }
    }
  }
};

// ========================
// LAYOUT SYSTEM
// ========================

export const layoutSystem = {
  // Container sizes
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  },
  
  // Grid system
  grid: {
    cols1: 'repeat(1, minmax(0, 1fr))',
    cols2: 'repeat(2, minmax(0, 1fr))',
    cols3: 'repeat(3, minmax(0, 1fr))',
    cols4: 'repeat(4, minmax(0, 1fr))',
    cols12: 'repeat(12, minmax(0, 1fr))',
  },
  
  // Common layouts
  layouts: {
    page: {
      padding: `${designTokens.spacing[6]} ${designTokens.spacing[4]}`,
      maxWidth: '1280px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: designTokens.colors.background,
    },
    
    section: {
      marginBottom: designTokens.spacing[12],
    },
    
    sidebar: {
      width: '280px',
      backgroundColor: designTokens.colors.surface,
      borderRight: `1px solid ${designTokens.colors.gray[200]}`,
      padding: designTokens.spacing[6],
    }
  }
};