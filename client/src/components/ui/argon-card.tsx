import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors, argonShadows } from './argon-theme';

interface ArgonCardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: keyof typeof argonShadows;
  variant?: 'default' | 'gradient';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export const ArgonCard = React.forwardRef<HTMLDivElement, ArgonCardProps>(
  ({ children, className, shadow = 'md', variant = 'default', color = 'primary', ...props }, ref) => {
    const cardStyles: React.CSSProperties = {
      backgroundColor: argonColors.white.main,
      borderRadius: '0.75rem',
      boxShadow: argonShadows[shadow],
    };

    if (variant === 'gradient') {
      const gradientColors = argonColors.gradients[color];
      cardStyles.background = `linear-gradient(310deg, ${gradientColors.main}, ${gradientColors.state})`;
      cardStyles.color = '#ffffff';
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={cardStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonCard.displayName = 'ArgonCard';

export const ArgonCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ArgonCardHeader.displayName = 'ArgonCardHeader';

export const ArgonCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ArgonCardContent.displayName = 'ArgonCardContent';

export const ArgonCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ArgonCardFooter.displayName = 'ArgonCardFooter';