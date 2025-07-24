/**
 * Unified Component System
 * All components use the centralized design tokens
 * Changing colors/spacing in design-system/index.ts updates everything
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button as MuiButton, Card as MuiCard, TextField as MuiTextField, Typography as MuiTypography } from '@mui/material';
import { designTokens, componentVariants, layoutSystem } from './index';

// ========================
// UNIVERSAL BUTTON COMPONENT
// ========================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = styled(({ children, variant = 'primary', size = 'md', fullWidth, disabled, onClick, className, ...rest }: ButtonProps) => {
  return (
    <MuiButton 
      className={className}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </MuiButton>
  );
})(({ variant = 'primary', size = 'md', fullWidth }) => {
  const baseStyles = componentVariants.button[variant] || componentVariants.button.primary;
  
  const sizeStyles = {
    sm: {
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.xs,
    },
    md: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      fontSize: designTokens.typography.fontSize.sm,
    },
    lg: {
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      fontSize: designTokens.typography.fontSize.base,
    }
  };
  
  return {
    ...baseStyles,
    ...sizeStyles[size],
    width: fullWidth ? '100%' : 'auto',
    textTransform: 'none',
    fontFamily: designTokens.typography.fontFamily.primary,
  };
});

// ========================
// UNIVERSAL CARD COMPONENT
// ========================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  padding?: keyof typeof designTokens.spacing;
  className?: string;
}

export const Card = styled(({ children, variant = 'default', padding, className, ...rest }: CardProps) => {
  return (
    <MuiCard className={className} {...rest}>
      {children}
    </MuiCard>
  );
})(({ variant = 'default', padding }) => {
  const baseStyles = componentVariants.card[variant] || componentVariants.card.default;
  
  return {
    ...baseStyles,
    ...(padding && { padding: designTokens.spacing[padding] }),
  };
});

// ========================
// CARD SECTIONS
// ========================

export const CardHeader = styled(Box)({
  marginBottom: designTokens.spacing[6],
  paddingBottom: designTokens.spacing[4],
  borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
});

export const CardBody = styled(Box)({
  marginBottom: designTokens.spacing[4],
});

export const CardFooter = styled(Box)({
  marginTop: designTokens.spacing[6],
  paddingTop: designTokens.spacing[4],
  borderTop: `1px solid ${designTokens.colors.gray[200]}`,
});

// ========================
// UNIVERSAL INPUT COMPONENT
// ========================

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;
}

export const Input = styled(({ className, ...props }: InputProps) => {
  return <MuiTextField className={className} {...props} />;
})({
  '& .MuiOutlinedInput-root': {
    ...componentVariants.input.default,
    '& fieldset': {
      borderColor: designTokens.colors.gray[300],
    },
    '&:hover fieldset': {
      borderColor: designTokens.colors.gray[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: designTokens.colors.primary[500],
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: designTokens.colors.text.secondary,
    fontSize: designTokens.typography.fontSize.sm,
    fontFamily: designTokens.typography.fontFamily.primary,
    '&.Mui-focused': {
      color: designTokens.colors.primary[500],
    },
  },
  '& .MuiFormHelperText-root': {
    color: designTokens.colors.text.secondary,
    fontSize: designTokens.typography.fontSize.xs,
    fontFamily: designTokens.typography.fontFamily.primary,
  },
});

// ========================
// TYPOGRAPHY COMPONENTS
// ========================

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const Text = styled(({ children, variant = 'body1', color = 'primary', align = 'left', className, ...rest }: TextProps) => {
  return (
    <MuiTypography 
      variant={variant} 
      className={className} 
      align={align}
      {...rest}
    >
      {children}
    </MuiTypography>
  );
})(({ color = 'primary' }) => {
  const colorMap = {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    error: designTokens.colors.error[500],
    warning: designTokens.colors.warning[500],
    success: designTokens.colors.success[500],
  };
  
  return {
    fontFamily: designTokens.typography.fontFamily.primary,
    color: colorMap[color],
  };
});

// ========================
// LAYOUT COMPONENTS
// ========================

export const Container = styled(Box)(({ maxWidth = 'xl' }: { maxWidth?: keyof typeof layoutSystem.container }) => ({
  ...layoutSystem.layouts.page,
  maxWidth: layoutSystem.container[maxWidth],
}));

export const Section = styled(Box)({
  ...layoutSystem.layouts.section,
});

export const Grid = styled(Box)(({ cols = 1 }: { cols?: 1 | 2 | 3 | 4 | 12 }) => {
  const gridMap = {
    1: layoutSystem.grid.cols1,
    2: layoutSystem.grid.cols2,
    3: layoutSystem.grid.cols3,
    4: layoutSystem.grid.cols4,
    12: layoutSystem.grid.cols12,
  };
  
  return {
    display: 'grid',
    gridTemplateColumns: gridMap[cols],
    gap: designTokens.spacing[6],
  };
});

export const Flex = styled(Box)(({ 
  direction = 'row', 
  align = 'stretch', 
  justify = 'flex-start', 
  gap = 4 
}: { 
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: keyof typeof designTokens.spacing;
}) => ({
  display: 'flex',
  flexDirection: direction,
  alignItems: align,
  justifyContent: justify,
  gap: designTokens.spacing[gap],
}));

// ========================
// STATS CARD COMPONENT
// ========================

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral' 
}) => {
  const changeColors = {
    positive: designTokens.colors.success[500],
    negative: designTokens.colors.error[500],
    neutral: designTokens.colors.text.secondary,
  };
  
  return (
    <Card variant="elevated">
      <Flex direction="row" align="center" justify="space-between">
        <Box>
          <Text variant="body2" color="secondary">{title}</Text>
          <Text variant="h4" style={{ fontWeight: designTokens.typography.fontWeight.bold }}>
            {value}
          </Text>
          {change && (
            <Text 
              variant="caption" 
              style={{ color: changeColors[changeType] }}
            >
              {change}
            </Text>
          )}
        </Box>
        {icon && (
          <Box style={{ 
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

// ========================
// FORM COMPONENTS
// ========================

export const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: designTokens.spacing[4],
});

export const FormSection = styled(Box)({
  marginBottom: designTokens.spacing[6],
});

export const FormTitle = styled(Text.withComponent('h3'))({
  fontSize: designTokens.typography.fontSize.lg,
  fontWeight: designTokens.typography.fontWeight.semibold,
  marginBottom: designTokens.spacing[4],
  color: designTokens.colors.text.primary,
});

export const FormGrid = styled(Grid)({
  marginTop: designTokens.spacing[4],
});

// Export everything for easy importing
export * from './index';