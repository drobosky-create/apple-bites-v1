import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const ArgonInput = React.forwardRef<HTMLInputElement, ArgonInputProps>(
  ({ className, label, error, variant = 'outlined', size = 'medium', ...props }, ref) => {
    const sizeClasses = {
      small: 'h-8 px-3 text-sm',
      medium: 'h-10 px-4 text-base',
      large: 'h-12 px-5 text-lg'
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            'argon-input',
            sizeClasses[size],
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

ArgonInput.displayName = "ArgonInput";

export { ArgonInput };