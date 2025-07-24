/**
 * Global CSS-in-JS Styles
 * Applied automatically to ensure consistent styling across the entire app
 */

import { createGlobalStyle } from 'styled-components';
import { designTokens } from './index';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: ${designTokens.typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${designTokens.typography.fontFamily.primary};
    font-size: ${designTokens.typography.fontSize.base};
    font-weight: ${designTokens.typography.fontWeight.normal};
    color: ${designTokens.colors.text.primary};
    background-color: ${designTokens.colors.background};
    min-height: 100vh;
  }

  /* Typography Scale */
  h1, .h1 {
    font-size: ${designTokens.typography.fontSize['4xl']};
    font-weight: ${designTokens.typography.fontWeight.bold};
    line-height: ${designTokens.typography.lineHeight.tight};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[6]};
  }

  h2, .h2 {
    font-size: ${designTokens.typography.fontSize['3xl']};
    font-weight: ${designTokens.typography.fontWeight.semibold};
    line-height: ${designTokens.typography.lineHeight.tight};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[5]};
  }

  h3, .h3 {
    font-size: ${designTokens.typography.fontSize['2xl']};
    font-weight: ${designTokens.typography.fontWeight.semibold};
    line-height: ${designTokens.typography.lineHeight.tight};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[4]};
  }

  h4, .h4 {
    font-size: ${designTokens.typography.fontSize.xl};
    font-weight: ${designTokens.typography.fontWeight.medium};
    line-height: ${designTokens.typography.lineHeight.normal};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[3]};
  }

  h5, .h5 {
    font-size: ${designTokens.typography.fontSize.lg};
    font-weight: ${designTokens.typography.fontWeight.medium};
    line-height: ${designTokens.typography.lineHeight.normal};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[3]};
  }

  h6, .h6 {
    font-size: ${designTokens.typography.fontSize.base};
    font-weight: ${designTokens.typography.fontWeight.medium};
    line-height: ${designTokens.typography.lineHeight.normal};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[2]};
  }

  p {
    font-size: ${designTokens.typography.fontSize.base};
    line-height: ${designTokens.typography.lineHeight.relaxed};
    color: ${designTokens.colors.text.primary};
    margin-bottom: ${designTokens.spacing[4]};
  }

  small {
    font-size: ${designTokens.typography.fontSize.sm};
    color: ${designTokens.colors.text.secondary};
  }

  /* Link Styles */
  a {
    color: ${designTokens.colors.primary[500]};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${designTokens.colors.primary[600]};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${designTokens.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Form Elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid ${designTokens.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${designTokens.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${designTokens.colors.gray[400]};
    border-radius: ${designTokens.borderRadius.full};

    &:hover {
      background: ${designTokens.colors.gray[500]};
    }
  }

  /* Animation Classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Responsive Design */
  @media (max-width: ${designTokens.breakpoints.sm}) {
    body {
      font-size: ${designTokens.typography.fontSize.sm};
    }

    h1, .h1 {
      font-size: ${designTokens.typography.fontSize['3xl']};
    }

    h2, .h2 {
      font-size: ${designTokens.typography.fontSize['2xl']};
    }

    h3, .h3 {
      font-size: ${designTokens.typography.fontSize.xl};
    }
  }
`;

// Theme Provider for consistent theming
export const themeConfig = {
  colors: designTokens.colors,
  typography: designTokens.typography,
  spacing: designTokens.spacing,
  borderRadius: designTokens.borderRadius,
  shadows: designTokens.shadows,
  breakpoints: designTokens.breakpoints,
};