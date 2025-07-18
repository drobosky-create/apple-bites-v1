// Authentic Argon Dashboard Components Adapted for Your Brand
import React from 'react';
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
    const Component = component;
    
    const bgColorClasses = {
      white: 'bg-white',
      primary: 'bg-purple-600', // Your brand primary
      secondary: 'bg-gray-600',
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-orange-500',
      error: 'bg-red-500',
      dark: 'bg-gray-800',
      transparent: 'bg-transparent'
    };

    const textColorClasses = {
      white: 'text-white',
      primary: 'text-purple-600',
      secondary: 'text-gray-600',
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-orange-500',
      error: 'text-red-500',
      dark: 'text-gray-800',
      text: 'text-gray-700'
    };

    const borderRadiusClasses = {
      xs: 'rounded-sm',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      section: 'rounded-3xl',
      none: ''
    };

    const shadowClasses = {
      xs: 'shadow-sm',
      sm: 'shadow',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      none: ''
    };

    const computedStyle = {
      ...style,
      ...(p !== undefined && { padding: `${p * 8}px` }),
      ...(m !== undefined && { margin: `${m * 8}px` }),
      ...(px !== undefined && { paddingLeft: `${px * 8}px`, paddingRight: `${px * 8}px` }),
      ...(py !== undefined && { paddingTop: `${py * 8}px`, paddingBottom: `${py * 8}px` }),
      ...(mt !== undefined && { marginTop: `${mt * 8}px` }),
      ...(mb !== undefined && { marginBottom: `${mb * 8}px` }),
      ...(ml !== undefined && { marginLeft: `${ml * 8}px` }),
      ...(mr !== undefined && { marginRight: `${mr * 8}px` }),
      ...(display && { display }),
      ...(justifyContent && { justifyContent }),
      ...(alignItems && { alignItems }),
      ...(width && { width }),
      ...(height && { height }),
      ...(lineHeight && { lineHeight }),
    };

    return React.createElement(
      Component,
      {
        className: cn(
          bgColorClasses[bgColor],
          color && textColorClasses[color],
          borderRadiusClasses[borderRadius],
          shadowClasses[shadow],
          variant === 'gradient' && bgGradient && `bg-gradient-to-r from-purple-600 to-blue-600`, // Your brand gradient
          className
        ),
        style: computedStyle,
        ref,
        ...props
      },
      children
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
    const variantStyles = {
      h1: 'text-5xl leading-tight font-bold',
      h2: 'text-4xl leading-tight font-bold',
      h3: 'text-3xl leading-normal font-bold',
      h4: 'text-2xl leading-normal font-bold',
      h5: 'text-xl leading-normal font-bold',
      h6: 'text-lg leading-relaxed font-bold',
      subtitle1: 'text-lg leading-relaxed',
      subtitle2: 'text-base leading-relaxed',
      body1: 'text-base leading-relaxed',
      body2: 'text-sm leading-relaxed',
      button: 'text-sm leading-normal uppercase font-bold',
      caption: 'text-xs leading-tight'
    };

    const colorClasses = {
      inherit: 'text-inherit',
      primary: textGradient ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' : 'text-purple-600',
      secondary: 'text-gray-600',
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-orange-500',
      error: 'text-red-500',
      light: 'text-gray-400',
      dark: 'text-gray-800',
      text: 'text-gray-700',
      white: 'text-white'
    };

    const fontWeightClasses = {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold'
    };

    const textTransformClasses = {
      none: '',
      capitalize: 'capitalize',
      uppercase: 'uppercase',
      lowercase: 'lowercase'
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
          colorClasses[color],
          fontWeight && fontWeightClasses[fontWeight],
          textTransformClasses[textTransform],
          className
        ),
        style: { ...style, opacity },
        ref,
        ...props
      },
      children
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
    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm min-h-[32px]',
      medium: 'px-4 py-2 text-sm min-h-[40px]',
      large: 'px-6 py-3 text-base min-h-[48px]'
    };

    const colorClasses = {
      contained: {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gray-600 text-white shadow-lg hover:shadow-xl',
        info: 'bg-blue-500 text-white shadow-lg hover:shadow-xl',
        success: 'bg-green-500 text-white shadow-lg hover:shadow-xl',
        warning: 'bg-orange-500 text-white shadow-lg hover:shadow-xl',
        error: 'bg-red-500 text-white shadow-lg hover:shadow-xl',
        light: 'bg-gray-100 text-gray-800 shadow-lg hover:shadow-xl',
        dark: 'bg-gray-800 text-white shadow-lg hover:shadow-xl',
        white: 'bg-white text-gray-800 shadow-lg hover:shadow-xl'
      },
      gradient: {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:shadow-xl',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl',
        warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl',
        error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl',
        light: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-lg hover:shadow-xl',
        dark: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl',
        white: 'bg-gradient-to-r from-white to-gray-50 text-gray-800 shadow-lg hover:shadow-xl'
      },
      outlined: {
        primary: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
        secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
        info: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        success: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
        warning: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
        error: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
        light: 'border-2 border-gray-300 text-gray-600 hover:bg-gray-300 hover:text-gray-800',
        dark: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
        white: 'border-2 border-white text-white hover:bg-white hover:text-gray-800'
      },
      text: {
        primary: 'text-purple-600 hover:bg-purple-50',
        secondary: 'text-gray-600 hover:bg-gray-50',
        info: 'text-blue-500 hover:bg-blue-50',
        success: 'text-green-500 hover:bg-green-50',
        warning: 'text-orange-500 hover:bg-orange-50',
        error: 'text-red-500 hover:bg-red-50',
        light: 'text-gray-400 hover:bg-gray-50',
        dark: 'text-gray-800 hover:bg-gray-50',
        white: 'text-white hover:bg-white/10'
      }
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          'hover:transform hover:-translate-y-0.5',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          sizeClasses[size],
          colorClasses[variant === 'gradient' ? 'gradient' : variant][color],
          circular ? 'rounded-full' : 'rounded-lg',
          iconOnly && 'aspect-square',
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ArgonButton.displayName = "ArgonButton";

export { ArgonBox, ArgonTypography, ArgonButton };