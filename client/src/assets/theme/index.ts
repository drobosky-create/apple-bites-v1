/**
 * NextJS Material UI Theme Configuration for Business Valuation Platform
 * Based on Argon Dashboard Material UI design system
 */

import { createTheme } from "@mui/material/styles";

// Type definitions for colors
export interface ColorPalette {
  main: string;
  focus?: string;
}

// Base colors from Argon Dashboard
const colors = {
  background: {
    default: "#f8f9fa",
    dark: "#172b4d",
  },
  text: {
    main: "#67748e",
    focus: "#67748e",
  },
  transparent: {
    main: "transparent",
  },
  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },
  black: {
    light: "#141414",
    main: "#000000",
    focus: "#000000",
  },
  primary: {
    main: "#5e72e4",
    focus: "#5e72e4",
  },
  secondary: {
    main: "#8392ab",
    focus: "#8392ab",
  },
  info: {
    main: "#11cdef",
    focus: "#11cdef",
  },
  success: {
    main: "#2dce89",
    focus: "#2dce89",
  },
  warning: {
    main: "#fb6340",
    focus: "#fb6340",
  },
  error: {
    main: "#f5365c",
    focus: "#f5365c",
  },
  light: {
    main: "#e9ecef",
    focus: "#e9ecef",
  },
  dark: {
    main: "#344767",
    focus: "#344767",
  },
  grey: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  gradients: {
    primary: {
      main: "#5e72e4",
      state: "#825ee4",
    },
    secondary: {
      main: "#627594",
      state: "#a8b8d8",
    },
    info: {
      main: "#1171ef",
      state: "#11cdef",
    },
    success: {
      main: "#2dce89",
      state: "#2dcecc",
    },
    warning: {
      main: "#fb6340",
      state: "#fbb140",
    },
    error: {
      main: "#f5365c",
      state: "#f56036",
    },
    light: {
      main: "#ced4da",
      state: "#ebeff4",
    },
    dark: {
      main: "#212229",
      state: "#212529",
    },
  },
};

// Create Material UI theme with Argon colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      dark: colors.primary.focus,
    },
    secondary: {
      main: colors.secondary.main,
      dark: colors.secondary.focus,
    },
    info: {
      main: colors.info.main,
      dark: colors.info.focus,
    },
    success: {
      main: colors.success.main,
      dark: colors.success.focus,
    },
    warning: {
      main: colors.warning.main,
      dark: colors.warning.focus,
    },
    error: {
      main: colors.error.main,
      dark: colors.error.focus,
    },
    background: {
      default: colors.background.default,
      paper: colors.white.main,
    },
    text: {
      primary: colors.dark.main,
      secondary: colors.text.main,
    },
    grey: colors.grey,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: colors.dark.main,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: colors.dark.main,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      color: colors.dark.main,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: colors.dark.main,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: colors.dark.main,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: colors.dark.main,
    },
    body1: {
      fontSize: '1rem',
      color: colors.text.main,
      lineHeight: 1.625,
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.main,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 700,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.0625rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(94, 114, 228, 0.3)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.gradients.primary.state} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.gradients.primary.state} 0%, ${colors.primary.main} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.gradients.secondary.state} 100%)`,
        },
        containedSuccess: {
          background: `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.gradients.success.state} 100%)`,
        },
        containedWarning: {
          background: `linear-gradient(135deg, ${colors.warning.main} 0%, ${colors.gradients.warning.state} 100%)`,
        },
        containedError: {
          background: `linear-gradient(135deg, ${colors.error.main} 0%, ${colors.gradients.error.state} 100%)`,
        },
        containedInfo: {
          background: `linear-gradient(135deg, ${colors.info.main} 0%, ${colors.gradients.info.state} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: colors.grey[300],
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: colors.text.main,
        },
        h1: { color: colors.dark.main },
        h2: { color: colors.dark.main },
        h3: { color: colors.dark.main },
        h4: { color: colors.dark.main },
        h5: { color: colors.dark.main },
        h6: { color: colors.dark.main },
      },
    },
  },
});

export default theme;
export { colors };