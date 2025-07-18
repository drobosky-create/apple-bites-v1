import React from 'react';
import { cn } from '@/lib/utils';

interface ArgonAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'circular' | 'rounded' | 'square';
  className?: string;
  children?: React.ReactNode;
}

export const ArgonAvatar = React.forwardRef<HTMLDivElement, ArgonAvatarProps>(
  ({ src, alt, size = 'md', variant = 'circular', className, children, ...props }, ref) => {
    
    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      xxl: 'w-20 h-20',
    };

    const variantClasses = {
      circular: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    };

    const baseClasses = [
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'overflow-hidden',
      'bg-gray-100',
      'transition-all',
      'duration-200',
      'ease-in-out',
      sizeClasses[size],
      variantClasses[variant],
    ];

    if (src) {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, className)}
          {...props}
        >
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, 'bg-gradient-to-br from-blue-400 to-purple-500 text-white', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ArgonAvatar.displayName = 'ArgonAvatar';