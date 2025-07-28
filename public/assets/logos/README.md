# Apple Bites Logo Assets

## Universal Logo Implementation

**Primary Logo**: `/public/apple-bites-logo.png` - Universal Apple Bites logo for all contexts

### Available Assets
- **apple-bites-logo-premium.png** - High-detail metallic apple with sophisticated money design and cyan accents
- **apple-bites-business-context.png** - Logo shown in professional business context  
- **apple-bites-meritage-logo.png** - Combined Apple Bites + Meritage Partners branding

## Usage

Use the `AppleBitesLogo` component for consistent logo implementation:

```tsx
import { AppleBitesLogo } from '@/components/AppleBitesLogo';

// Basic usage
<AppleBitesLogo size="medium" />

// Custom size
<AppleBitesLogo width={100} height={100} />

// With click handler
<AppleBitesLogo size="large" onClick={() => navigate('/')} />
```

## Brand Integration

The universal logo features:
- Dark metallic apple with cyan glow effects (#00BFA6 teal brand color)
- Professional money design symbolizing business valuation
- Optimal for both light and dark backgrounds
- Matches Apple Bites teal/navy theme system

## Component Sizes
- **small**: 32x32px - Navigation, buttons
- **medium**: 48x48px - Default, cards  
- **large**: 64x64px - Headers, prominent placement
- **xl**: 128x128px - Landing pages, hero sections

Last Updated: July 28, 2025