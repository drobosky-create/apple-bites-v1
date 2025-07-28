/**
 * Apple Bites Logo Utilities
 * Centralized logo path management
 */

// Universal Apple Bites logo path
export const APPLE_BITES_LOGO = '/apple-bites-logo.png';

// Legacy logo paths (for migration reference)
export const LEGACY_LOGOS = {
  premium: '/assets/logos/apple-bites-logo-premium.png',
  meritage: '/assets/logos/apple-bites-meritage-logo.png',
  context: '/assets/logos/apple-bites-business-context.png'
} as const;

// Logo sizing utilities
export const LOGO_SIZES = {
  small: 32,
  medium: 48,
  large: 64,
  xl: 128
} as const;

export type LogoSize = keyof typeof LOGO_SIZES;