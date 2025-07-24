/**
 * Material Dashboard 2 Wrapper
 * Provides minimal wrapper without global theme changes
 */

import React from 'react';

interface MaterialWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function MaterialWrapper({ children }: MaterialWrapperProps) {
  return <>{children}</>;
}