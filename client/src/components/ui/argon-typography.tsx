import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors, argonTypography } from './argon-theme';

interface ArgonTypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'text' | 'white' | 'dark';
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
  gradient?: boolean;
  children: React.ReactNode;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export const ArgonTypography = React.forwardRef<HTMLElement, ArgonTypographyProps>(
  ({ 
    variant = 'body1', 
    color = 'text', 
    fontWeight = 'regular', 
    gradient = false, 
    children, 
    className, 
    component, 
    ...props 
  }, ref) => {
    
    // Define component mapping
    const componentMap = {
      h1: 'h1',
      h2: 'h2', 
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      body1: 'p',
      body2: 'p',
      subtitle1: 'h6',
      subtitle2: 'h6',
      caption: 'span',
      button: 'span',
    };

    const Component = (component || componentMap[variant]) as keyof JSX.IntrinsicElements;

    // Typography variant styles
    const variantStyles = {
      h1: { fontSize: '3rem', lineHeight: '1.25', fontWeight: argonTypography.fontWeightMedium },
      h2: { fontSize: '2.25rem', lineHeight: '1.3', fontWeight: argonTypography.fontWeightMedium },
      h3: { fontSize: '1.875rem', lineHeight: '1.375', fontWeight: argonTypography.fontWeightMedium },
      h4: { fontSize: '1.5rem', lineHeight: '1.375', fontWeight: argonTypography.fontWeightMedium },
      h5: { fontSize: '1.25rem', lineHeight: '1.375', fontWeight: argonTypography.fontWeightMedium },
      h6: { fontSize: '1rem', lineHeight: '1.625', fontWeight: argonTypography.fontWeightMedium },
      body1: { fontSize: '1.25rem', lineHeight: '1.625', fontWeight: argonTypography.fontWeightRegular },
      body2: { fontSize: '1rem', lineHeight: '1.6', fontWeight: argonTypography.fontWeightRegular },
      subtitle1: { fontSize: '1.25rem', lineHeight: '1.625', fontWeight: argonTypography.fontWeightRegular },
      subtitle2: { fontSize: '1rem', lineHeight: '1.6', fontWeight: argonTypography.fontWeightMedium },
      caption: { fontSize: '0.75rem', lineHeight: '1.25', fontWeight: argonTypography.fontWeightRegular },
      button: { fontSize: '0.875rem', lineHeight: '1.5', fontWeight: argonTypography.fontWeightBold, textTransform: 'uppercase' as const },
    };

    // Color mapping
    const colorMap = {
      primary: argonColors.primary.main,
      secondary: argonColors.secondary.main,
      info: argonColors.info.main,
      success: argonColors.success.main,
      warning: argonColors.warning.main,
      error: argonColors.error.main,
      text: argonColors.text.main,
      white: argonColors.white.main,
      dark: argonColors.dark.main,
    };

    // Font weight mapping
    const fontWeightMap = {
      light: argonTypography.fontWeightLight,
      regular: argonTypography.fontWeightRegular,
      medium: argonTypography.fontWeightMedium,
      bold: argonTypography.fontWeightBold,
    };

    const styles: React.CSSProperties = {
      fontFamily: argonTypography.fontFamily,
      ...variantStyles[variant],
      fontWeight: fontWeightMap[fontWeight],
      margin: 0,
    };

    if (gradient && argonColors.gradients[color as keyof typeof argonColors.gradients]) {
      const gradientColor = argonColors.gradients[color as keyof typeof argonColors.gradients];
      styles.background = `linear-gradient(310deg, ${gradientColor.main}, ${gradientColor.state})`;
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.backgroundClip = 'text';
    } else {
      styles.color = colorMap[color];
    }

    return (
      <Component
        ref={ref as any}
        className={cn(className)}
        style={styles}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ArgonTypography.displayName = 'ArgonTypography';