import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors } from './argon-theme';

interface ArgonBadgeProps {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const ArgonBadge = React.forwardRef<HTMLSpanElement, ArgonBadgeProps>(
  ({ variant = 'filled', color = 'primary', size = 'sm', children, className, ...props }, ref) => {
    
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm',
    };

    const badgeColorMap = {
      primary: {
        background: '#eaecfb',
        text: '#2643e9',
      },
      secondary: {
        background: '#e4e8ed',
        text: '#5974a2',
      },
      info: {
        background: '#aaedf9',
        text: '#03acca',
      },
      success: {
        background: '#b0eed3',
        text: '#1aae6f',
      },
      warning: {
        background: '#fee6e0',
        text: '#ff3709',
      },
      error: {
        background: '#fdd1da',
        text: '#f80031',
      },
      light: {
        background: '#ffffff',
        text: '#c7d3de',
      },
      dark: {
        background: '#8097bf',
        text: '#1e2e4a',
      },
    };

    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-bold',
      'uppercase',
      'rounded-lg',
      'leading-none',
      'whitespace-nowrap',
      sizeClasses[size],
    ];

    const colorStyles: React.CSSProperties = {};

    if (variant === 'filled') {
      colorStyles.backgroundColor = badgeColorMap[color].background;
      colorStyles.color = badgeColorMap[color].text;
    } else if (variant === 'outlined') {
      colorStyles.backgroundColor = 'transparent';
      colorStyles.color = badgeColorMap[color].text;
      colorStyles.border = `1px solid ${badgeColorMap[color].text}`;
    }

    return (
      <span
        ref={ref}
        className={cn(baseClasses, className)}
        style={colorStyles}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ArgonBadge.displayName = 'ArgonBadge';