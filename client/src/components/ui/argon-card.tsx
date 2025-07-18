import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'gradient';
  gradient?: 'primary' | 'info' | 'success' | 'warning' | 'error';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  children: React.ReactNode;
}

const ArgonCard = React.forwardRef<HTMLDivElement, ArgonCardProps>(
  ({ 
    className, 
    variant = 'light', 
    gradient,
    shadow = 'lg',
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "argon-card";
    
    const variantClasses = {
      light: "bg-white",
      dark: "argon-card-dark",
      gradient: gradient ? `argon-gradient-${gradient}` : "argon-gradient-primary"
    };

    const shadowClasses = {
      sm: "argon-shadow-sm",
      md: "argon-shadow-md", 
      lg: "argon-shadow-lg",
      xl: "argon-shadow-xl",
      none: ""
    };

    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          shadowClasses[shadow],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonCard.displayName = "ArgonCard";

interface ArgonCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  children: React.ReactNode;
}

const ArgonCardHeader = React.forwardRef<HTMLDivElement, ArgonCardHeaderProps>(
  ({ className, gradient = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-6 pb-0",
          gradient && "argon-gradient-primary text-white",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonCardHeader.displayName = "ArgonCardHeader";

interface ArgonCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ArgonCardContent = React.forwardRef<HTMLDivElement, ArgonCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("p-6 pt-2", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonCardContent.displayName = "ArgonCardContent";

interface ArgonCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ArgonCardFooter = React.forwardRef<HTMLDivElement, ArgonCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("p-6 pt-0", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonCardFooter.displayName = "ArgonCardFooter";

export { ArgonCard, ArgonCardHeader, ArgonCardContent, ArgonCardFooter };