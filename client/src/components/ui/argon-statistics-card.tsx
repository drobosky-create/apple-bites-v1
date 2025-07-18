// Authentic Argon Statistics Cards with Your Brand Colors
import React from 'react';
import { cn } from '@/lib/utils';
import { ArgonBox, ArgonTypography } from './argon-authentic';

interface DetailedStatisticsCardProps {
  title: string;
  count: string | number;
  icon: {
    color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    component: React.ReactNode;
  };
  percentage?: {
    color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    count: string;
    text: string;
  };
  className?: string;
}

const DetailedStatisticsCard: React.FC<DetailedStatisticsCardProps> = ({
  title,
  count,
  icon,
  percentage,
  className
}) => {
  const iconColorClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600',
    secondary: 'bg-gray-600',
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500'
  };

  const percentageColorClasses = {
    primary: 'text-purple-600',
    secondary: 'text-gray-600',
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-orange-500',
    error: 'text-red-500'
  };

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden',
      className
    )}>
      <ArgonBox p={3}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <ArgonTypography
              variant="button"
              color="text"
              textTransform="uppercase"
              fontWeight="bold"
              className="text-gray-600 text-xs mb-1 opacity-70"
            >
              {title}
            </ArgonTypography>
            <ArgonTypography
              variant="h4"
              color="dark"
              fontWeight="bold"
              className="mb-0"
            >
              {count}
            </ArgonTypography>
            {percentage && (
              <div className="flex items-center mt-2">
                <ArgonTypography
                  variant="button"
                  className={cn(
                    'font-bold mr-1',
                    percentageColorClasses[percentage.color]
                  )}
                >
                  {percentage.count}
                </ArgonTypography>
                <ArgonTypography variant="caption" color="text">
                  {percentage.text}
                </ArgonTypography>
              </div>
            )}
          </div>
          
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-white ml-4',
            iconColorClasses[icon.color]
          )}>
            {icon.component}
          </div>
        </div>
      </ArgonBox>
    </div>
  );
};

interface MiniStatisticsCardProps {
  bgColor?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark';
  title: {
    fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
    text: string;
  };
  count: string | number;
  percentage?: {
    color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'white';
    text: string;
  };
  icon: {
    color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    component: React.ReactNode;
  };
  direction?: 'right' | 'left';
  className?: string;
}

const MiniStatisticsCard: React.FC<MiniStatisticsCardProps> = ({
  bgColor = 'white',
  title,
  count,
  percentage,
  icon,
  direction = 'right',
  className
}) => {
  const bgColorClasses = {
    white: 'bg-white',
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600',
    secondary: 'bg-gray-600',
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500',
    dark: 'bg-gray-800'
  };

  const iconColorClasses = {
    primary: bgColor === 'white' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white',
    secondary: bgColor === 'white' ? 'bg-gray-600' : 'bg-white',
    info: bgColor === 'white' ? 'bg-blue-500' : 'bg-white',
    success: bgColor === 'white' ? 'bg-green-500' : 'bg-white',
    warning: bgColor === 'white' ? 'bg-orange-500' : 'bg-white',
    error: bgColor === 'white' ? 'bg-red-500' : 'bg-white'
  };

  const textColor = bgColor === 'white' ? 'dark' : 'white';
  const iconTextColor = bgColor === 'white' ? 'white' : 'dark';

  return (
    <div className={cn(
      'rounded-xl shadow-lg border border-gray-100 overflow-hidden',
      bgColorClasses[bgColor],
      className
    )}>
      <ArgonBox p={2}>
        <div className="flex items-center">
          {direction === 'left' && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mr-3',
              iconColorClasses[icon.color],
              bgColor === 'white' ? 'text-white' : 'text-gray-800'
            )}>
              {icon.component}
            </div>
          )}
          
          <div className="flex-1">
            <ArgonTypography
              variant="button"
              color={textColor}
              textTransform="uppercase"
              fontWeight={title.fontWeight}
              opacity={bgColor === 'white' ? 1 : 0.7}
              className="text-xs mb-1"
            >
              {title.text}
            </ArgonTypography>
            <div className="flex items-baseline">
              <ArgonTypography
                variant="h5"
                color={textColor}
                fontWeight="bold"
                className="mr-2"
              >
                {count}
              </ArgonTypography>
              {percentage && (
                <ArgonTypography
                  variant="button"
                  color={percentage.color}
                  fontWeight="bold"
                  className="text-xs"
                >
                  {percentage.text}
                </ArgonTypography>
              )}
            </div>
          </div>

          {direction === 'right' && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center ml-3',
              iconColorClasses[icon.color],
              bgColor === 'white' ? 'text-white' : 'text-gray-800'
            )}>
              {icon.component}
            </div>
          )}
        </div>
      </ArgonBox>
    </div>
  );
};

export { DetailedStatisticsCard, MiniStatisticsCard };