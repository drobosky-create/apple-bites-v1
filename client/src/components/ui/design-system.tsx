import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Paper,
  Container,
  Divider,
  IconButton,
  Chip,
  Badge,
  Avatar,
} from '@mui/material';

// Brand Colors - Consistent throughout the app
export const brandColors = {
  primary: {
    main: '#0b2147',      // Navy blue
    light: '#1a365d',     // Lighter navy
    dark: '#081729',      // Darker navy
    gradient: 'linear-gradient(135deg, #0b2147 0%, #1a365d 100%)',
  },
  secondary: {
    main: '#81e5d8',      // Teal
    light: '#a3ebe1',     // Light teal
    dark: '#4ecdc4',      // Dark teal
    gradient: 'linear-gradient(135deg, #81e5d8 0%, #4493de 100%)',
  },
  accent: {
    main: '#4493de',      // Blue
    light: '#6ba8e5',     // Light blue
    dark: '#2d7bd8',      // Dark blue
  },
  background: {
    primary: 'linear-gradient(135deg, #0b1426 0%, #1a202c 25%, #2d3748 50%, #1a202c 75%, #0b2147 100%)',
    card: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.05)',
    overlay: 'rgba(11, 33, 71, 0.7)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#f7fafc',
    muted: '#a0aec0',
    dark: '#2d3748',
    label: '#67748e',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    strong: 'rgba(255, 255, 255, 0.3)',
  },
  status: {
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
  }
};

// Typography System
export const typography = {
  fontFamily: {
    primary: 'Roboto, Helvetica, Arial, sans-serif',
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
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
  }
};

// Spacing System
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
  '5xl': '6rem',   // 96px
};

// Border Radius System
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glass: '0 4px 20px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(129, 229, 216, 0.3)',
};

// Consistent Background Component
export const AppBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: brandColors.background.primary,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2381e5d8" fill-opacity="0.05"><circle cx="7" cy="7" r="1"/><circle cx="27" cy="7" r="1"/><circle cx="47" cy="7" r="1"/><circle cx="7" cy="27" r="1"/><circle cx="27" cy="27" r="1"/><circle cx="47" cy="27" r="1"/><circle cx="7" cy="47" r="1"/><circle cx="27" cy="47" r="1"/><circle cx="47" cy="47" r="1"/></g></g></svg>')`,
  },
}));

// Glass Card Component
export const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: brandColors.background.card,
  backdropFilter: 'blur(10px)',
  borderRadius: borderRadius['2xl'],
  border: `1px solid ${brandColors.border.light}`,
  boxShadow: shadows.glass,
  position: 'relative',
  overflow: 'visible',
}));

// Floating Header Component
export const FloatingHeader = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: 0,
  right: 0,
  margin: '0 auto',
  maxWidth: '300px',
  backgroundColor: brandColors.background.card,
  borderRadius: borderRadius['2xl'],
  boxShadow: shadows.glass,
  padding: `${spacing['2xl']} ${spacing.lg}`,
  zIndex: 2,
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${brandColors.border.medium}`,
}));

// Primary Button Component
export const PrimaryButton = styled(Button)(({ theme }) => ({
  background: brandColors.primary.gradient,
  color: brandColors.text.primary,
  borderRadius: borderRadius.lg,
  padding: `${spacing.md} ${spacing['2xl']}`,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  textTransform: 'none',
  boxShadow: shadows.md,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${brandColors.primary.light} 0%, ${brandColors.primary.main} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  },
  '&:disabled': {
    background: brandColors.text.muted,
    color: brandColors.text.label,
    transform: 'none',
    boxShadow: 'none',
  },
}));

// Secondary Button Component
export const SecondaryButton = styled(Button)(({ theme }) => ({
  background: brandColors.secondary.gradient,
  color: brandColors.text.primary,
  borderRadius: borderRadius.lg,
  padding: `${spacing.md} ${spacing['2xl']}`,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  textTransform: 'none',
  boxShadow: shadows.md,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${brandColors.accent.main} 0%, ${brandColors.secondary.main} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: shadows.glow,
  },
  '&:disabled': {
    background: brandColors.text.muted,
    color: brandColors.text.label,
    transform: 'none',
    boxShadow: 'none',
  },
}));

// Outline Button Component
export const OutlineButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: brandColors.text.primary,
  border: `2px solid ${brandColors.border.medium}`,
  borderRadius: borderRadius.lg,
  padding: `${spacing.md} ${spacing['2xl']}`,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: brandColors.background.card,
    borderColor: brandColors.border.strong,
    transform: 'translateY(-1px)',
  },
}));

// Consistent Text Field
export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: `2px solid ${brandColors.secondary.main}`,
    },
  },
  '& .MuiInputLabel-root': {
    color: brandColors.text.label,
    fontSize: typography.fontSize.base,
    '&.Mui-focused': {
      color: brandColors.secondary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    color: brandColors.text.muted,
    fontSize: typography.fontSize.sm,
  },
}));

// Section Header Component
export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold,
  color: brandColors.text.primary,
  marginBottom: spacing.lg,
  textAlign: 'center',
  fontFamily: typography.fontFamily.heading,
}));

// Section Subheader Component
export const SectionSubheader = styled(Typography)(({ theme }) => ({
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.medium,
  color: brandColors.text.secondary,
  marginBottom: spacing.md,
  fontFamily: typography.fontFamily.body,
}));

// Body Text Component
export const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.normal,
  color: brandColors.text.secondary,
  lineHeight: 1.6,
  fontFamily: typography.fontFamily.body,
}));

// Muted Text Component
export const MutedText = styled(Typography)(({ theme }) => ({
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.normal,
  color: brandColors.text.muted,
  fontFamily: typography.fontFamily.body,
}));

// Status Chip Component
export const StatusChip = styled(Chip)<{ status: 'success' | 'warning' | 'error' | 'info' }>(({ status }) => ({
  backgroundColor: brandColors.status[status],
  color: brandColors.text.primary,
  fontWeight: typography.fontWeight.medium,
  fontSize: typography.fontSize.sm,
  borderRadius: borderRadius.full,
}));

// Progress Container
export const ProgressContainer = styled(Box)(({ theme }) => ({
  backgroundColor: brandColors.background.glass,
  borderRadius: borderRadius.xl,
  padding: spacing.lg,
  border: `1px solid ${brandColors.border.light}`,
  backdropFilter: 'blur(5px)',
}));

// Form Container
export const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: brandColors.background.card,
  borderRadius: borderRadius['2xl'],
  padding: `${spacing['2xl']} ${spacing.xl}`,
  border: `1px solid ${brandColors.border.light}`,
  backdropFilter: 'blur(10px)',
  boxShadow: shadows.glass,
}));

// Dashboard Card
export const DashboardCard = styled(GlassCard)(({ theme }) => ({
  padding: spacing['2xl'],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: shadows.xl,
  },
}));

// Metric Display
export const MetricDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: spacing.lg,
  backgroundColor: brandColors.background.glass,
  borderRadius: borderRadius.xl,
  border: `1px solid ${brandColors.border.light}`,
}));

// Logo Container
export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: spacing.lg,
  '& img': {
    height: '60px',
    width: 'auto',
    filter: 'brightness(1.1)',
  },
}));

// Divider with consistent styling
export const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: brandColors.border.light,
  margin: `${spacing.xl} 0`,
}));

// Container with consistent padding
export const AppContainer = styled(Container)(({ theme }) => ({
  paddingTop: spacing['3xl'],
  paddingBottom: spacing['3xl'],
  position: 'relative',
  zIndex: 1,
}));

export default {
  brandColors,
  typography,
  spacing,
  borderRadius,
  shadows,
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
  StatusChip,
  ProgressContainer,
  FormContainer,
  DashboardCard,
  MetricDisplay,
  LogoContainer,
  StyledDivider,
  AppContainer,
};