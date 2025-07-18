import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  children: React.ReactNode;
}

const ArgonButton = React.forwardRef<HTMLButtonElement, ArgonButtonProps>(
  ({ 
    className, 
    variant = 'contained', 
    color = 'primary', 
    size = 'medium', 
    gradient = true,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "argon-button";
    
    const variantClasses = {
      contained: gradient ? `argon-button-${color}` : `bg-${color}-500 text-white`,
      outlined: `border-2 border-${color}-500 text-${color}-500 bg-transparent hover:bg-${color}-50`,
      text: `text-${color}-500 bg-transparent hover:bg-${color}-50`
    };

    const sizeClasses = {
      small: "min-h-[32px] px-8 py-2 text-xs",
      medium: "min-h-[40px] px-5 py-2.5 text-sm",
      large: "min-h-[47px] px-16 py-3.5 text-base"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
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

export { ArgonButton };