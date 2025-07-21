import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordVisibilityToggleProps {
  onToggle: (visible: boolean) => void;
  className?: string;
}

export function PasswordVisibilityToggle({ onToggle, className = "" }: PasswordVisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    onToggle(newVisible);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`px-3 py-1 h-8 ${className}`}
      onClick={handleToggle}
    >
      {isVisible ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}

// Consolidated password field state logic
export function usePasswordFields() {
  const [passwordStates, setPasswordStates] = useState<Record<string, boolean>>({});

  const togglePassword = (fieldName: string) => {
    setPasswordStates(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const getPasswordType = (fieldName: string) => {
    return passwordStates[fieldName] ? 'text' : 'password';
  };

  const isPasswordVisible = (fieldName: string) => {
    return passwordStates[fieldName] || false;
  };

  return {
    togglePassword,
    getPasswordType,
    isPasswordVisible,
    PasswordToggle: ({ fieldName, className }: { fieldName: string; className?: string }) => (
      <PasswordVisibilityToggle 
        onToggle={() => togglePassword(fieldName)}
        className={className}
      />
    )
  };
}