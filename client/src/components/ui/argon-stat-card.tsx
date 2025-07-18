import React from 'react';
import { cn } from '@/lib/utils';
import { ArgonCard, ArgonCardContent } from './argon-card';
import { ArgonTypography } from './argon-typography';

interface ArgonStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error';
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  className?: string;
}

const ArgonStatCard: React.FC<ArgonStatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  subtitle,
  trend,
  className
}) => {
  const colorClasses = {
    primary: 'text-purple-600',
    info: 'text-blue-500', 
    success: 'text-green-500',
    warning: 'text-orange-500',
    error: 'text-red-500'
  };

  const gradientClasses = {
    primary: 'argon-gradient-primary',
    info: 'argon-gradient-info',
    success: 'argon-gradient-success', 
    warning: 'argon-gradient-warning',
    error: 'argon-gradient-error'
  };

  const trendIcon = trend?.direction === 'up' ? '↗' : trend?.direction === 'down' ? '↘' : '→';
  const trendColor = trend?.direction === 'up' ? 'text-green-500' : trend?.direction === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <ArgonCard className={cn('relative overflow-hidden', className)}>
      <ArgonCardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <ArgonTypography 
              variant="caption" 
              color="text"
              className="text-gray-600 uppercase tracking-wide font-medium mb-1"
            >
              {title}
            </ArgonTypography>
            <ArgonTypography 
              variant="h4" 
              color="dark"
              fontWeight="bold"
              className="mb-1"
            >
              {value}
            </ArgonTypography>
            {subtitle && (
              <ArgonTypography 
                variant="caption" 
                color="text"
                className="text-gray-500"
              >
                {subtitle}
              </ArgonTypography>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center text-white',
              gradientClasses[color]
            )}>
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center space-x-2">
            <span className={cn('text-sm font-medium', trendColor)}>
              {trendIcon} {trend.value}
            </span>
            <span className="text-sm text-gray-500">
              {trend.label}
            </span>
          </div>
        )}
      </ArgonCardContent>
    </ArgonCard>
  );
};

export { ArgonStatCard };