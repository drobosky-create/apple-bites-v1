// Main Design System Exports
export * from './design-system';
export * from './material-dashboard-system';

// Re-export commonly used components for easy access
export {
  // Design System Components
  AppBackground,
  GlassCard,
  FloatingHeader,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  StyledTextField,
  SectionHeader,
  SectionSubheader,
  BodyText,
  MutedText,
  FormContainer,
  DashboardCard,
  AppContainer,
} from './design-system';

export {
  // Material Dashboard Components
  MaterialCard,
  MaterialCardHeader,
  MaterialCardBody,
  MaterialCardFooter,
  MaterialButton,
  MaterialTextField,
  MaterialTitle,
  MaterialCardTitle,
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
  appleColors,
  materialColors,
  boxShadows,
  cardHeaders,
} from './material-dashboard-system';

// Brand colors for quick access
export const brandColors = {
  // Apple Bites Brand Colors
  navy: '#0b2147',
  navyLight: '#1a365d',
  navyDark: '#081729',
  teal: '#81e5d8',
  tealLight: '#a3ebe1',
  tealDark: '#4ecdc4',
  blue: '#4493de',
  blueLight: '#6ba8e5',
  blueDark: '#2d7bd8',
  
  // Status Colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#00acc1',
  
  // Neutral Colors
  white: '#ffffff',
  gray: '#999999',
  darkGray: '#3C4858',
  lightGray: '#AAAAAA',
};

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Common border radius values
export const borderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: 9999,
};