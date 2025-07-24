/**
 * Universal Design System Components
 * Clean, working components that use design tokens
 */

import React from 'react';
import { Button as MuiButton, Card as MuiCard, Typography, Box } from '@mui/material';
import { tokens } from './tokens';

// ========================
// BUTTON COMPONENT
// ========================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick,
  fullWidth,
  disabled,
}) => {
  const getStyles = () => {
    const base = {
      padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.medium,
      fontFamily: tokens.typography.fontFamily,
      textTransform: 'none',
      boxShadow: tokens.shadows.sm,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: tokens.colors.primary[500],
          color: '#ffffff',
          border: 'none',
          '&:hover': {
            backgroundColor: tokens.colors.primary[600],
          }
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: tokens.colors.primary[500],
          border: `1px solid ${tokens.colors.primary[500]}`,
          '&:hover': {
            backgroundColor: tokens.colors.primary[50],
          }
        };
      case 'success':
        return {
          ...base,
          backgroundColor: tokens.colors.success[500],
          color: '#ffffff',
          border: 'none',
          '&:hover': {
            backgroundColor: tokens.colors.success[600],
          }
        };
    }
  };

  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={getStyles()}
    >
      {children}
    </MuiButton>
  );
};

// ========================
// CARD COMPONENT
// ========================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default',
  className
}) => {
  const getStyles = () => {
    const base = {
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing[6],
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          backgroundColor: tokens.colors.surface,
          boxShadow: tokens.shadows.lg,
        };
      case 'gradient':
        return {
          ...base,
          background: `linear-gradient(135deg, ${tokens.colors.primary[500]}, ${tokens.colors.primary[700]})`,
          color: '#ffffff',
          boxShadow: tokens.shadows.lg,
        };
      default:
        return {
          ...base,
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.gray[200]}`,
          boxShadow: tokens.shadows.sm,
        };
    }
  };

  return (
    <MuiCard sx={getStyles()} className={className}>
      {children}
    </MuiCard>
  );
};

// ========================
// TEXT COMPONENT
// ========================

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  color?: 'primary' | 'secondary';
  className?: string;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body1', 
  color = 'primary',
  className
}) => {
  const getColor = () => {
    return color === 'secondary' 
      ? tokens.colors.text.secondary 
      : tokens.colors.text.primary;
  };

  return (
    <Typography
      variant={variant}
      className={className}
      sx={{
        fontFamily: tokens.typography.fontFamily,
        color: getColor(),
      }}
    >
      {children}
    </Typography>
  );
};

// ========================
// LAYOUT COMPONENTS
// ========================

export const Container: React.FC<{
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ children, maxWidth = '1200px' }) => (
  <Box sx={{
    maxWidth,
    margin: '0 auto',
    padding: tokens.spacing[6],
    minHeight: '100vh',
    backgroundColor: tokens.colors.background,
  }}>
    {children}
  </Box>
);

export const Stack: React.FC<{
  children: React.ReactNode;
  spacing?: keyof typeof tokens.spacing;
  direction?: 'row' | 'column';
}> = ({ children, spacing = 4, direction = 'column' }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: direction,
    gap: tokens.spacing[spacing],
  }}>
    {children}
  </Box>
);

export const Grid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: keyof typeof tokens.spacing;
}> = ({ children, columns = 1, gap = 4 }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: tokens.spacing[gap],
  }}>
    {children}
  </Box>
);