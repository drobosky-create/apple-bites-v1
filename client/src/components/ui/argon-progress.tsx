import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors, linearGradient } from './argon-theme';

interface ArgonProgressProps {
  value: number;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  variant?: 'determinate' | 'indeterminate';
  size?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  className?: string;
}

export const ArgonProgress = React.forwardRef<HTMLDivElement, ArgonProgressProps>(
  ({ value, color = 'info', variant = 'determinate', size = 'medium', gradient = false, className, ...props }, ref) => {
    
    const sizeClasses = {
      small: 'h-1',
      medium: 'h-1.5',
      large: 'h-2',
    };

    const colorMap = {
      primary: argonColors.primary.main,
      secondary: argonColors.secondary.main,
      info: argonColors.info.main,
      success: argonColors.success.main,
      warning: argonColors.warning.main,
      error: argonColors.error.main,
    };

    const progressStyles: React.CSSProperties = {};
    
    if (gradient && argonColors.gradients[color]) {
      progressStyles.background = linearGradient(
        argonColors.gradients[color].main,
        argonColors.gradients[color].state
      );
    } else {
      progressStyles.backgroundColor = colorMap[color];
    }

    const clampedValue = Math.max(0, Math.min(100, value));

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-md bg-gray-200',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'absolute top-0 left-0 h-full rounded-sm transition-all duration-600 ease-out',
            variant === 'indeterminate' && 'animate-pulse'
          )}
          style={{
            ...progressStyles,
            width: variant === 'determinate' ? `${clampedValue}%` : '100%',
            transform: 'translate(0, 0)',
          }}
        />
      </div>
    );
  }
);

ArgonProgress.displayName = 'ArgonProgress';