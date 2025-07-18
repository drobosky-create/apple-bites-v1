import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ArgonCardProps {
  children: ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

export function ArgonCard({ 
  children, 
  className = "", 
  shadow = 'md',
  gradient = false,
  color = 'primary'
}: ArgonCardProps) {
  const shadowClass = `shadow-argon${shadow === 'md' ? '' : `-${shadow}`}`;
  const gradientClass = gradient ? `bg-gradient-${color}` : 'bg-white';
  
  return (
    <Card className={`
      ${gradientClass}
      ${shadowClass}
      border-0 
      transition-all 
      duration-300 
      hover:transform 
      hover:scale-[1.02] 
      ${className}
    `}>
      {children}
    </Card>
  );
}