/**
 * Argon Dashboard 2 MUI Theme Configuration
 * Adapted for React/Tailwind CSS implementation
 */

export const argonColors = {
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
} as const;

export const argonTypography = {
  fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  size: {
    xxs: "0.65rem",
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
} as const;

export const argonShadows = {
  xs: "0 2px 9px -5px rgba(0, 0, 0, 0.15)",
  sm: "0 5px 10px 0 rgba(0, 0, 0, 0.12)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.07)",
  lg: "0 8px 26px -4px rgba(0, 0, 0, 0.15), 0 8px 9px -5px rgba(0, 0, 0, 0.06)",
  xl: "0 23px 45px -11px rgba(0, 0, 0, 0.25)",
  xxl: "0 20px 27px 0 rgba(0, 0, 0, 0.05)",
} as const;

export const argonBorderRadius = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  xxl: "1.5rem",
  section: "10rem",
} as const;

// Helper functions
export const linearGradient = (color: string, colorState: string, angle = 310) =>
  `linear-gradient(${angle}deg, ${color}, ${colorState})`;

export const pxToRem = (number: number, baseNumber = 16) => `${number / baseNumber}rem`;

export const rgba = (color: string, opacity: number) => {
  // Simple hex to rgba conversion
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};