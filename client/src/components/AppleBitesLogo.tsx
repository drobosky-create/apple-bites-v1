/**
 * Universal Apple Bites Logo Component
 * Centralized logo component for consistent usage across the application
 */

import React from 'react';

interface AppleBitesLogoProps {
  /** Logo size variant */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /** Custom width (overrides size) */
  width?: number;
  /** Custom height (overrides size) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
}

const sizeMap = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 64, height: 64 },
  xl: { width: 128, height: 128 }
};

export function AppleBitesLogo({
  size = 'medium',
  width,
  height,
  className = '',
  alt = 'Apple Bites Business Assessment',
  onClick
}: AppleBitesLogoProps) {
  const dimensions = {
    width: width || sizeMap[size].width,
    height: height || sizeMap[size].height
  };

  return (
    <img
      src="/apple-bites-logo.png"
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={`apple-bites-logo ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        objectFit: 'contain'
      }}
    />
  );
}

export default AppleBitesLogo;