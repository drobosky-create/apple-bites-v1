// Complete Argon Dashboard Component System
import React from 'react';
import { cn } from '@/lib/utils';

// Argon Box Component
interface ArgonBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  component?: keyof JSX.IntrinsicElements;
  display?: 'flex' | 'block' | 'inline-flex' | 'inline-block' | 'none';
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  p?: number;
  m?: number;
  mx?: number;
  my?: number;
  px?: number;
  py?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  bgColor?: string;
  borderRadius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  opacity?: number;
  variant?: 'contained' | 'gradient';
  bgGradient?: 'primary' | 'info' | 'success' | 'warning' | 'error';
}

const ArgonBox = React.forwardRef<HTMLElement, ArgonBoxProps>(
  ({ 
    className, 
    component = 'div',
    display,
    position,
    p, m, mx, my, px, py, mt, mb, ml, mr,
    bgColor,
    borderRadius = 'md',
    shadow = 'none',
    opacity,
    variant,
    bgGradient,
    children,
    style,
    ...props 
  }, ref) => {
    const Component = component;
    
    const getSpacingClass = (prop: number | undefined, type: string) => {
      if (prop === undefined) return '';
      return `${type}-${prop * 4}px`;
    };

    const borderRadiusClasses = {
      xs: 'rounded-sm',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      xxl: 'rounded-3xl'
    };

    const shadowClasses = {
      xs: 'argon-shadow-sm',
      sm: 'argon-shadow-sm',
      md: 'argon-shadow-md',
      lg: 'argon-shadow-lg',
      xl: 'argon-shadow-xl',
      xxl: 'argon-shadow-xl',
      none: ''
    };

    const computedStyle = {
      ...style,
      ...(p !== undefined && { padding: `${p * 8}px` }),
      ...(m !== undefined && { margin: `${m * 8}px` }),
      ...(mx !== undefined && { marginLeft: `${mx * 8}px`, marginRight: `${mx * 8}px` }),
      ...(my !== undefined && { marginTop: `${my * 8}px`, marginBottom: `${my * 8}px` }),
      ...(px !== undefined && { paddingLeft: `${px * 8}px`, paddingRight: `${px * 8}px` }),
      ...(py !== undefined && { paddingTop: `${py * 8}px`, paddingBottom: `${py * 8}px` }),
      ...(mt !== undefined && { marginTop: `${mt * 8}px` }),
      ...(mb !== undefined && { marginBottom: `${mb * 8}px` }),
      ...(ml !== undefined && { marginLeft: `${ml * 8}px` }),
      ...(mr !== undefined && { marginRight: `${mr * 8}px` }),
      ...(opacity !== undefined && { opacity }),
      ...(display && { display }),
      ...(position && { position }),
      ...(bgColor && { backgroundColor: bgColor }),
    };

    return React.createElement(
      Component,
      {
        className: cn(
          borderRadiusClasses[borderRadius],
          shadowClasses[shadow],
          variant === 'gradient' && bgGradient && `argon-gradient-${bgGradient}`,
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

// Argon Avatar Component
interface ArgonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'rounded' | 'circular';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  bgGradient?: 'primary' | 'info' | 'success' | 'warning' | 'error';
}

const ArgonAvatar = React.forwardRef<HTMLDivElement, ArgonAvatarProps>(
  ({ 
    className, 
    src, 
    alt = '',
    size = 'md',
    variant = 'circular',
    shadow = 'sm',
    bgGradient,
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      xxl: 'w-20 h-20'
    };

    const shadowClasses = {
      sm: 'argon-shadow-sm',
      md: 'argon-shadow-md',
      lg: 'argon-shadow-lg',
      xl: 'argon-shadow-xl',
      none: ''
    };

    return (
      <div
        className={cn(
          'inline-flex items-center justify-center overflow-hidden transition-all duration-200',
          sizeClasses[size],
          variant === 'circular' ? 'rounded-full' : 'rounded-lg',
          shadowClasses[shadow],
          bgGradient && `argon-gradient-${bgGradient}`,
          !src && !bgGradient && 'bg-gray-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          children
        )}
      </div>
    );
  }
);

ArgonAvatar.displayName = "ArgonAvatar";

// Argon Badge Component
interface ArgonBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'filled' | 'gradient' | 'outlined';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  circular?: boolean;
}

const ArgonBadge = React.forwardRef<HTMLSpanElement, ArgonBadgeProps>(
  ({ 
    className, 
    variant = 'filled',
    color = 'primary',
    size = 'sm',
    circular = false,
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base'
    };

    const colorClasses = {
      filled: {
        primary: 'bg-purple-600 text-white',
        secondary: 'bg-gray-600 text-white',
        info: 'bg-blue-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-orange-500 text-white',
        error: 'bg-red-500 text-white',
        light: 'bg-gray-100 text-gray-800',
        dark: 'bg-gray-800 text-white'
      },
      gradient: {
        primary: 'argon-gradient-primary text-white',
        secondary: 'argon-gradient-secondary text-white',
        info: 'argon-gradient-info text-white',
        success: 'argon-gradient-success text-white',
        warning: 'argon-gradient-warning text-white',
        error: 'argon-gradient-error text-white',
        light: 'argon-gradient-light text-gray-800',
        dark: 'argon-gradient-dark text-white'
      },
      outlined: {
        primary: 'border border-purple-600 text-purple-600',
        secondary: 'border border-gray-600 text-gray-600',
        info: 'border border-blue-500 text-blue-500',
        success: 'border border-green-500 text-green-500',
        warning: 'border border-orange-500 text-orange-500',
        error: 'border border-red-500 text-red-500',
        light: 'border border-gray-300 text-gray-600',
        dark: 'border border-gray-800 text-gray-800'
      }
    };

    return (
      <span
        className={cn(
          'inline-flex items-center justify-center font-medium leading-none',
          sizeClasses[size],
          colorClasses[variant][color],
          circular ? 'rounded-full' : 'rounded-md',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ArgonBadge.displayName = "ArgonBadge";

export { ArgonBox, ArgonAvatar, ArgonBadge };