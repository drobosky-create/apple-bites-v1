import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ArgonStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  gradient?: boolean;
}

export function ArgonStatCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = 'primary',
  gradient = false 
}: ArgonStatCardProps) {
  const getColorClasses = () => {
    if (gradient) {
      return {
        background: `bg-gradient-${color}`,
        text: 'text-white',
        icon: 'text-white/80',
        trend: 'text-white/70'
      };
    }
    
    return {
      background: 'bg-white',
      text: 'text-gray-900',
      icon: `text-argon-${color}`,
      trend: 'text-gray-600'
    };
  };

  const colors = getColorClasses();
  
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (gradient) return 'text-white/70';
    
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={`${colors.background} ${gradient ? 'text-white' : ''} border-0 shadow-argon hover:shadow-argon-lg transition-all duration-300`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'} uppercase tracking-wide`}>
              {title}
            </p>
            <h3 className={`text-2xl font-bold ${colors.text} mt-1`}>
              {value}
            </h3>
            {subtitle && (
              <p className={`text-sm ${gradient ? 'text-white/70' : 'text-gray-500'} mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className={`flex-shrink-0 ${colors.icon}`}>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/10">
                {icon}
              </div>
            </div>
          )}
        </div>
        
        {trend && (
          <div className={`flex items-center text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1 font-medium">{trend.value}</span>
            <span className="ml-1">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
}