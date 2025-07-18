import React from 'react';
import { cn } from '@/lib/utils';
import { argonColors } from './argon-theme';

interface ArgonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  success?: boolean;
  label?: string;
}

export const ArgonInput = React.forwardRef<HTMLInputElement, ArgonInputProps>(
  ({ className, variant = 'outlined', error = false, success = false, label, ...props }, ref) => {
    const inputId = React.useId();
    
    const getInputStyles = () => {
      const baseClasses = [
        'w-full',
        'px-3',
        'py-2',
        'text-sm',
        'font-normal',
        'leading-5',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'focus:outline-none',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
      ];

      const baseStyles: React.CSSProperties = {
        fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
        fontSize: '0.875rem',
        color: argonColors.text.main,
      };

      if (variant === 'outlined') {
        baseClasses.push(
          'border',
          'rounded-lg',
          'bg-white'
        );
        
        if (error) {
          baseStyles.borderColor = argonColors.error.main;
          baseStyles.boxShadow = `0 3px 9px 0 ${argonColors.error.main}20, 3px 4px 8px 0 ${argonColors.error.main}10`;
        } else if (success) {
          baseStyles.borderColor = argonColors.success.main;
          baseStyles.boxShadow = `0 3px 9px 0 ${argonColors.success.main}20, 3px 4px 8px 0 ${argonColors.success.main}10`;
        } else {
          baseStyles.borderColor = '#d2d6da';
        }

        // Focus state
        baseClasses.push('focus:border-info');
        baseStyles.boxShadow = `0 3px 9px 0 ${argonColors.info.main}00, 3px 4px 8px 0 ${argonColors.info.main}10`;
      }

      return { classes: baseClasses, styles: baseStyles };
    };

    const { classes, styles } = getInputStyles();

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
            style={{ fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif' }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(classes, className)}
          style={styles}
          {...props}
        />
      </div>
    );
  }
);

ArgonInput.displayName = 'ArgonInput';

interface ArgonTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  label?: string;
}

export const ArgonTextarea = React.forwardRef<HTMLTextAreaElement, ArgonTextareaProps>(
  ({ className, error = false, success = false, label, ...props }, ref) => {
    const textareaId = React.useId();
    
    const baseClasses = [
      'w-full',
      'px-3',
      'py-2',
      'text-sm',
      'font-normal',
      'leading-5',
      'border',
      'rounded-lg',
      'bg-white',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'focus:border-info',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'resize-vertical',
    ];

    const styles: React.CSSProperties = {
      fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      color: argonColors.text.main,
      minHeight: '100px',
    };

    if (error) {
      styles.borderColor = argonColors.error.main;
    } else if (success) {
      styles.borderColor = argonColors.success.main;
    } else {
      styles.borderColor = '#d2d6da';
    }

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
            style={{ fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif' }}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(baseClasses, className)}
          style={styles}
          {...props}
        />
      </div>
    );
  }
);

ArgonTextarea.displayName = 'ArgonTextarea';