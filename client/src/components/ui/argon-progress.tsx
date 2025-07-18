import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  showValue?: boolean;
}

const ArgonProgress = React.forwardRef<HTMLDivElement, ArgonProgressProps>(
  ({ 
    className, 
    value = 0, 
    color = 'primary', 
    variant = 'linear',
    size = 'medium',
    label,
    showValue = false,
    ...props 
  }, ref) => {
    const colorClasses = {
      primary: 'argon-gradient-primary',
      secondary: 'argon-gradient-secondary',
      info: 'argon-gradient-info',
      success: 'argon-gradient-success',
      warning: 'argon-gradient-warning',
      error: 'argon-gradient-error'
    };

    const sizeClasses = {
      small: 'h-1',
      medium: 'h-2',
      large: 'h-3'
    };

    if (variant === 'linear') {
      return (
        <div className="w-full" ref={ref} {...props}>
          {(label || showValue) && (
            <div className="flex justify-between items-center mb-2">
              {label && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </span>
              )}
              {showValue && (
                <span className="text-sm text-gray-500">
                  {Math.round(value)}%
                </span>
              )}
            </div>
          )}
          <div className={cn(
            'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
            sizeClasses[size],
            className
          )}>
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-300 ease-out',
                colorClasses[color]
              )}
              style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            />
          </div>
        </div>
      );
    }

    // Circular variant
    const radius = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    const strokeWidth = size === 'small' ? 2 : size === 'medium' ? 3 : 4;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="inline-flex items-center justify-center" ref={ref} {...props}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={cn(
              'transition-all duration-300 ease-out',
              colorClasses[color].replace('argon-gradient-', 'text-')
            )}
          />
        </svg>
        {showValue && (
          <span className="absolute text-sm font-medium">
            {Math.round(value)}%
          </span>
        )}
      </div>
    );
  }
);

ArgonProgress.displayName = "ArgonProgress";

export { ArgonProgress };