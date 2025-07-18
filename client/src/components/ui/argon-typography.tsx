import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonTypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light' | 'text' | 'white';
  gradient?: boolean;
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
  children: React.ReactNode;
  component?: keyof JSX.IntrinsicElements;
}

const ArgonTypography = React.forwardRef<HTMLElement, ArgonTypographyProps>(
  ({ 
    className, 
    variant = 'body1', 
    color = 'text',
    gradient = false,
    fontWeight,
    children,
    component,
    ...props 
  }, ref) => {
    const variantStyles = {
      h1: 'text-5xl leading-tight',
      h2: 'text-4xl leading-normal',
      h3: 'text-3xl leading-normal',
      h4: 'text-2xl leading-normal',
      h5: 'text-xl leading-normal',
      h6: 'text-lg leading-relaxed',
      subtitle1: 'text-xl leading-relaxed',
      subtitle2: 'text-base leading-relaxed',
      body1: 'text-xl leading-relaxed',
      body2: 'text-base leading-relaxed',
      caption: 'text-xs leading-tight',
      button: 'text-sm leading-normal uppercase font-bold'
    };

    const colorStyles = {
      primary: gradient ? 'argon-text-gradient' : 'text-purple-600',
      secondary: 'text-gray-600',
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-orange-500',
      error: 'text-red-500',
      dark: 'text-gray-800',
      light: 'text-gray-400',
      text: 'text-gray-700 dark:text-gray-300',
      white: 'text-white'
    };

    const fontWeightStyles = {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold'
    };

    const getComponent = () => {
      if (component) return component;
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
        return variant as keyof JSX.IntrinsicElements;
      }
      return 'p';
    };

    const Component = getComponent();

    return React.createElement(
      Component,
      {
        className: cn(
          'font-sans',
          variantStyles[variant],
          gradient ? 'argon-text-gradient' : colorStyles[color],
          fontWeight && fontWeightStyles[fontWeight],
          className
        ),
        ref,
        ...props
      },
      children
    );
  }
);

ArgonTypography.displayName = "ArgonTypography";

export { ArgonTypography };