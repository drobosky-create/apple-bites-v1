// Material Dashboard theme extensions for MUI
export const materialDashboardTheme = {
  gradients: {
    primary: {
      main: "#e91e63",
      state: "#ad1457"
    },
    secondary: {
      main: "#7b1fa2",
      state: "#6a1b9a"
    },
    info: {
      main: "#1A73E8",
      state: "#1662C4"
    },
    success: {
      main: "#4CAF50",
      state: "#43A047"
    },
    warning: {
      main: "#fb8c00",
      state: "#f57c00"
    },
    error: {
      main: "#F44335",
      state: "#D32F2F"
    },
    light: {
      main: "#f0f2f5",
      state: "#e9ecef"
    },
    dark: {
      main: "#42424a",
      state: "#191919"
    }
  },
  
  boxShadows: {
    xs: "0 2px 9px -5px rgba(0, 0, 0, 0.15)",
    sm: "0 5px 13px -5px rgba(0, 0, 0, 0.20)",
    md: "0 8px 26px -4px rgba(0, 0, 0, 0.15)",
    lg: "0 23px 45px -11px rgba(0, 0, 0, 0.25)",
    xl: "0 35px 65px -12px rgba(0, 0, 0, 0.35)",
    xxl: "0 54px 100px -12px rgba(0, 0, 0, 0.35)",
    inset: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
    
    colored: {
      primary: "0 4px 20px 0 rgba(233, 30, 99, 0.14)",
      secondary: "0 4px 20px 0 rgba(123, 31, 162, 0.14)",
      info: "0 4px 20px 0 rgba(26, 115, 232, 0.14)",
      success: "0 4px 20px 0 rgba(76, 175, 80, 0.14)",
      warning: "0 4px 20px 0 rgba(251, 140, 0, 0.14)",
      error: "0 4px 20px 0 rgba(244, 67, 53, 0.14)",
      light: "0 4px 20px 0 rgba(240, 242, 245, 0.14)",
      dark: "0 4px 20px 0 rgba(66, 66, 74, 0.14)"
    }
  },

  borders: {
    borderRadius: {
      xs: "0.125rem",
      sm: "0.25rem", 
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      xxl: "1.25rem",
      section: "1.5rem"
    }
  },

  functions: {
    linearGradient: (color1: string, color2: string) => `linear-gradient(195deg, ${color1}, ${color2})`,
    pxToRem: (px: number) => `${px / 16}rem`,
    rgba: (color: string, opacity: number) => color.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    boxShadow: (offset: number[], radius: number[], color: string, opacity: number) => 
      `${offset[0]}px ${offset[1]}px ${radius[0]}px ${radius[1]}px ${color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)}`
  }
};

// Augment MUI theme with Material Dashboard properties
declare module '@mui/material/styles' {
  interface Theme {
    gradients: typeof materialDashboardTheme.gradients;
    boxShadows: typeof materialDashboardTheme.boxShadows;
    borders: typeof materialDashboardTheme.borders;
    functions: typeof materialDashboardTheme.functions;
  }
}