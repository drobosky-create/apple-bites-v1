// NextJS Material UI Components - Direct Replacement for Argon Dashboard
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  BoxProps, 
  TypographyProps, 
  ButtonProps 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { cn } from '@/lib/utils';

// Argon Box - Core layout component
interface ArgonBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  component?: keyof JSX.IntrinsicElements;
  p?: number;
  m?: number;
  px?: number;
  py?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  bgColor?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'transparent';
  color?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'text';
  borderRadius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section' | 'none';
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  display?: 'flex' | 'block' | 'inline-flex' | 'inline-block' | 'none';
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  width?: string;
  height?: string;
  lineHeight?: number;
  variant?: 'contained' | 'gradient';
  bgGradient?: 'primary' | 'info' | 'success' | 'warning' | 'error';
}

// Styled Material UI Box with Argon styling
const StyledArgonBox = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'bgColor', 'bgGradient'].includes(prop as string),
})<ArgonBoxProps>(({ theme, variant, bgColor, bgGradient }) => {
  const getBackground = () => {
    if (variant === 'gradient' && bgGradient) {
      const gradients = {
        primary: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
        info: 'linear-gradient(135deg, #11cdef 0%, #1171ef 100%)',
        success: 'linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)',
        warning: 'linear-gradient(135deg, #fb6340 0%, #fbb140 100%)',
        error: 'linear-gradient(135deg, #f5365c 0%, #f56036 100%)',
      };
      return gradients[bgGradient] || gradients.primary;
    }
    
    const colors = {
      white: '#ffffff',
      primary: '#5e72e4',
      secondary: '#8392ab',
      info: '#11cdef',
      success: '#2dce89',
      warning: '#fb6340',
      error: '#f5365c',
      dark: '#344767',
      transparent: 'transparent',
    };
    
    return colors[bgColor as keyof typeof colors] || 'transparent';
  };

  return {
    background: getBackground(),
    ...(variant === 'gradient' && {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }),
  };
});

const ArgonBox = React.forwardRef<HTMLElement, ArgonBoxProps>(
  ({ 
    className, 
    component = 'div',
    p, m, px, py, mt, mb, ml, mr,
    bgColor = 'transparent',
    color,
    borderRadius = 'none',
    shadow = 'none',
    display,
    justifyContent,
    alignItems,
    width,
    height,
    lineHeight,
    variant,
    bgGradient,
    children,
    style,
    ...props 
  }, ref) => {
    return (
      <StyledArgonBox
        component={component as any}
        variant={variant}
        bgColor={bgColor}
        bgGradient={bgGradient}
        ref={ref}
        sx={{
          ...(p !== undefined && { p }),
          ...(m !== undefined && { m }),
          ...(px !== undefined && { px }),
          ...(py !== undefined && { py }),
          ...(mt !== undefined && { mt }),
          ...(mb !== undefined && { mb }),
          ...(ml !== undefined && { ml }),
          ...(mr !== undefined && { mr }),
          ...(display && { display }),
          ...(justifyContent && { justifyContent }),
          ...(alignItems && { alignItems }),
          ...(width && { width }),
          ...(height && { height }),
          ...(lineHeight && { lineHeight }),
          ...(borderRadius !== 'none' && { 
            borderRadius: {
              xs: 1, sm: 2, md: 3, lg: 4, xl: 5, section: 8
            }[borderRadius] || 3 
          }),
          ...(shadow !== 'none' && { 
            boxShadow: {
              xs: 1, sm: 2, md: 4, lg: 8, xl: 12
            }[shadow] || 0 
          }),
          ...(color && { 
            color: {
              white: '#ffffff', primary: '#5e72e4', secondary: '#8392ab',
              info: '#11cdef', success: '#2dce89', warning: '#fb6340',
              error: '#f5365c', dark: '#344767', text: '#67748e'
            }[color] || color 
          }),
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </StyledArgonBox>
    );
  }
);

ArgonBox.displayName = "ArgonBox";

// Argon Typography with your brand colors
interface ArgonTypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'button' | 'caption';
  color?: 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark' | 'text' | 'white';
  fontWeight?: false | 'light' | 'regular' | 'medium' | 'bold';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textGradient?: boolean;
  opacity?: number;
  component?: keyof JSX.IntrinsicElements;
}

// Styled Material UI Typography with Argon styling
const StyledArgonTypography = styled(Typography, {
  shouldForwardProp: (prop) => !['textGradient'].includes(prop as string),
})<ArgonTypographyProps>(({ theme, color, textGradient, fontWeight, textTransform, opacity }) => {
  const getColor = () => {
    const colors = {
      inherit: 'inherit',
      primary: textGradient ? 'transparent' : '#5e72e4',
      secondary: '#8392ab',
      info: '#11cdef',
      success: '#2dce89',
      warning: '#fb6340',
      error: '#f5365c',
      light: '#e9ecef',
      dark: '#344767',
      text: '#67748e',
      white: '#ffffff'
    };
    return colors[color as keyof typeof colors] || colors.dark;
  };

  const getBackground = () => {
    if (textGradient && color) {
      const gradients = {
        primary: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
        info: 'linear-gradient(135deg, #11cdef 0%, #1171ef 100%)',
        success: 'linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)',
        warning: 'linear-gradient(135deg, #fb6340 0%, #fbb140 100%)',
        error: 'linear-gradient(135deg, #f5365c 0%, #f56036 100%)',
      };
      return gradients[color as keyof typeof gradients] || gradients.primary;
    }
    return 'transparent';
  };

  return {
    color: getColor(),
    background: getBackground(),
    WebkitBackgroundClip: textGradient ? 'text' : 'initial',
    backgroundClip: textGradient ? 'text' : 'initial',
    fontWeight: fontWeight ? {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    }[fontWeight] : undefined,
    textTransform: textTransform || 'none',
    opacity: opacity || 1,
  };
});

const ArgonTypography = React.forwardRef<HTMLElement, ArgonTypographyProps>(
  ({ 
    className, 
    variant = 'body1',
    color = 'dark',
    fontWeight = false,
    textTransform = 'none',
    textGradient = false,
    opacity = 1,
    component,
    children,
    style,
    ...props 
  }, ref) => {
    return (
      <StyledArgonTypography
        variant={variant}
        component={component}
        color={color as any}
        fontWeight={fontWeight}
        textTransform={textTransform}
        textGradient={textGradient}
        opacity={opacity}
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </StyledArgonTypography>
    );
  }
);

ArgonTypography.displayName = "ArgonTypography";

// Argon Button with your brand colors
interface ArgonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'contained' | 'outlined' | 'gradient';
  color?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  circular?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

// Styled Material UI Button with Argon styling
const StyledArgonButton = styled(Button, {
  shouldForwardProp: (prop) => !['circular', 'iconOnly', 'gradientVariant'].includes(prop as string),
})<ArgonButtonProps & { gradientVariant?: boolean }>(({ theme, color, variant, size, circular, iconOnly, gradientVariant }) => {
  const getBackground = () => {
    if (variant === 'gradient' || gradientVariant) {
      const gradients = {
        primary: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
        secondary: 'linear-gradient(135deg, #8392ab 0%, #a8b8d8 100%)',
        info: 'linear-gradient(135deg, #11cdef 0%, #1171ef 100%)',
        success: 'linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)',
        warning: 'linear-gradient(135deg, #fb6340 0%, #fbb140 100%)',
        error: 'linear-gradient(135deg, #f5365c 0%, #f56036 100%)',
        light: 'linear-gradient(135deg, #e9ecef 0%, #ebeff4 100%)',
        dark: 'linear-gradient(135deg, #344767 0%, #212529 100%)',
        white: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      };
      return gradients[color as keyof typeof gradients] || gradients.primary;
    }
    return undefined;
  };

  return {
    borderRadius: circular ? '50%' : '12px',
    fontWeight: 600,
    textTransform: 'none',
    background: getBackground(),
    boxShadow: variant === 'contained' || variant === 'gradient' 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      : 'none',
    minWidth: iconOnly ? 'auto' : '64px',
    aspectRatio: iconOnly ? '1' : 'auto',
    '&:hover': {
      background: getBackground()?.replace('135deg', '315deg'),
      transform: 'translateY(-1px)',
      boxShadow: variant === 'contained' || variant === 'gradient'
        ? `0 6px 10px -1px rgba(${color === 'primary' ? '94, 114, 228' : '0, 0, 0'}, 0.3)`
        : 'none',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  };
});

const ArgonButton = React.forwardRef<HTMLButtonElement, ArgonButtonProps>(
  ({ 
    className, 
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    circular = false,
    iconOnly = false,
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    return (
      <StyledArgonButton
        variant={variant === 'gradient' ? 'contained' : variant}
        color={color as any}
        size={size}
        circular={circular}
        iconOnly={iconOnly}
        fullWidth={fullWidth}
        gradientVariant={variant === 'gradient'}
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledArgonButton>
    );
  }
);

ArgonButton.displayName = "ArgonButton";

export { ArgonBox, ArgonTypography, ArgonButton };