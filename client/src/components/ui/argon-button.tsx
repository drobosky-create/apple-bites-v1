import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors, linearGradient } from './argon-theme';

interface ArgonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  children: React.ReactNode;
}

export const ArgonButton = React.forwardRef<HTMLButtonElement, ArgonButtonProps>(
  ({ className, variant = 'contained', color = 'primary', size = 'medium', gradient = false, children, ...props }, ref) => {
    const getButtonStyles = () => {
      const baseClasses = [
        'inline-flex',
        'justify-center',
        'items-center',
        'font-bold',
        'text-center',
        'uppercase',
        'transition-all',
        'duration-150',
        'ease-in',
        'select-none',
        'hover:-translate-y-0.5',
        'disabled:pointer-events-none',
        'disabled:opacity-65',
        'focus:outline-none',
        'focus:ring-0',
      ];

      // Size classes
      const sizeClasses = {
        small: ['min-h-8', 'px-8', 'py-2', 'text-xs'],
        medium: ['min-h-10', 'px-5', 'py-2.5', 'text-sm'],
        large: ['min-h-12', 'px-16', 'py-3.5', 'text-sm'],
      };

      // Border radius
      baseClasses.push('rounded-lg');

      // Color mapping
      const colorMap = {
        primary: argonColors.primary.main,
        secondary: argonColors.secondary.main,
        info: argonColors.info.main,
        success: argonColors.success.main,
        warning: argonColors.warning.main,
        error: argonColors.error.main,
      };

      const colorStyles: React.CSSProperties = {};
      
      if (variant === 'contained') {
        if (gradient && argonColors.gradients[color]) {
          colorStyles.background = linearGradient(
            argonColors.gradients[color].main,
            argonColors.gradients[color].state
          );
        } else {
          colorStyles.backgroundColor = colorMap[color];
        }
        colorStyles.color = '#ffffff';
        colorStyles.boxShadow = '0 4px 6px 0 rgba(52, 71, 103, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08)';
        baseClasses.push('text-white');
      } else if (variant === 'outlined') {
        colorStyles.backgroundColor = 'transparent';
        colorStyles.borderColor = colorMap[color];
        colorStyles.color = colorMap[color];
        baseClasses.push('border', 'border-current', 'hover:opacity-75');
      } else if (variant === 'text') {
        colorStyles.backgroundColor = 'transparent';
        colorStyles.color = colorMap[color];
        baseClasses.push('hover:opacity-75');
      }

      return {
        classes: [...baseClasses, ...sizeClasses[size]],
        styles: colorStyles,
      };
    };

    const { classes, styles } = getButtonStyles();

    return (
      <button
        className={cn(classes, className)}
        style={styles}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ArgonButton.displayName = 'ArgonButton';