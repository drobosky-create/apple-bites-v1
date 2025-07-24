/**
 * Simple Design System Components
 * Working components that use the centralized design tokens
 */

import React from 'react';
import { Button as MuiButton, Card as MuiCard, Typography, Box } from '@mui/material';
import { designTokens } from './index';

// ========================
// SIMPLE BUTTON COMPONENT
// ========================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  onClick?: () => void;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  style = {},
  fullWidth,
  disabled,
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      borderRadius: designTokens.borderRadius.md,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      fontFamily: designTokens.typography.fontFamily.primary,
      textTransform: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      ...style
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: designTokens.colors.primary[500],
          color: '#ffffff',
          '&:hover': {
            backgroundColor: designTokens.colors.primary[600],
          }
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: designTokens.colors.primary[500],
          border: `1px solid ${designTokens.colors.primary[500]}`,
          '&:hover': {
            backgroundColor: designTokens.colors.primary[50],
          }
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: designTokens.colors.success[500],
          color: '#ffffff',
          '&:hover': {
            backgroundColor: designTokens.colors.success[600],
          }
        };
      default:
        return baseStyles;
    }
  };

  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={getButtonStyles()}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

// ========================
// SIMPLE CARD COMPONENT
// ========================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  style = {},
  ...props 
}) => {
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: designTokens.borderRadius.lg,
      padding: designTokens.spacing[6],
      ...style
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: designTokens.colors.surface,
          boxShadow: designTokens.shadows.lg,
          border: 'none',
        };
      case 'gradient':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[700]})`,
          color: '#ffffff',
          boxShadow: designTokens.shadows.lg,
          border: 'none',
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: designTokens.colors.surface,
          boxShadow: designTokens.shadows.base,
          border: `1px solid ${designTokens.colors.gray[200]}`,
        };
    }
  };

  return (
    <MuiCard sx={getCardStyles()} {...props}>
      {children}
    </MuiCard>
  );
};

// ========================
// SIMPLE TEXT COMPONENT
// ========================

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body1', 
  color = 'primary',
  style = {},
  ...props 
}) => {
  const getTextColor = () => {
    switch (color) {
      case 'secondary':
        return designTokens.colors.text.secondary;
      case 'error':
        return designTokens.colors.error[500];
      case 'success':
        return designTokens.colors.success[500];
      default:
        return designTokens.colors.text.primary;
    }
  };

  return (
    <Typography
      variant={variant}
      sx={{
        fontFamily: designTokens.typography.fontFamily.primary,
        color: getTextColor(),
        ...style
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

// ========================
// LAYOUT COMPONENTS
// ========================

export const Container: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ 
  children, 
  style = {} 
}) => (
  <Box sx={{
    padding: `${designTokens.spacing[6]} ${designTokens.spacing[4]}`,
    maxWidth: '1280px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: designTokens.colors.background,
    ...style
  }}>
    {children}
  </Box>
);

export const Flex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  gap?: number;
  style?: React.CSSProperties;
}> = ({ 
  children, 
  direction = 'row', 
  align = 'stretch', 
  justify = 'flex-start', 
  gap = 4,
  style = {}
}) => (
  <Box sx={{
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap: designTokens.spacing[gap as keyof typeof designTokens.spacing] || designTokens.spacing[4],
    ...style
  }}>
    {children}
  </Box>
);

// ========================
// CARD SECTIONS
// ========================

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ 
    marginBottom: designTokens.spacing[6],
    paddingBottom: designTokens.spacing[4],
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
  }}>
    {children}
  </Box>
);

export const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ marginBottom: designTokens.spacing[4] }}>
    {children}
  </Box>
);

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{
    marginTop: designTokens.spacing[6],
    paddingTop: designTokens.spacing[4],
    borderTop: `1px solid ${designTokens.colors.gray[200]}`,
  }}>
    {children}
  </Box>
);

// ========================
// STATS CARD COMPONENT
// ========================

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  changeType = 'neutral' 
}) => {
  return (
    <Card variant="elevated">
      <Flex direction="row" align="center" justify="space-between">
        <Box>
          <Text variant="body2" color="secondary">{title}</Text>
          <Text variant="h4" style={{ fontWeight: designTokens.typography.fontWeight.bold }}>
            {value}
          </Text>
        </Box>
        {icon && (
          <Box sx={{ 
            color: designTokens.colors.primary[500],
            fontSize: '2rem' 
          }}>
            {icon}
          </Box>
        )}
      </Flex>
    </Card>
  );
};

// Export design tokens for direct use
export { designTokens };