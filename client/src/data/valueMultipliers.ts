// Centralized value multipliers and grade data
import type { OperationalGrade } from '@/utils/gradeLogic';

// Brand colors from Argon Dashboard
export const ArgonColors = {
  primary: '#0b2147',    // Navy blue
  secondary: '#1a365d',  // Lighter navy
  accent: '#4493de',     // Blue
  teal: '#81e5d8',       // Teal
  gradient: {
    primary: 'from-purple-400 via-blue-500 to-blue-800',
    secondary: 'from-gray-300 to-gray-500'
  }
} as const;

// Valuation multipliers by grade
export const valueMultipliers: Record<OperationalGrade, number> = {
  'A': 7.5,
  'B': 5.7,
  'C': 4.2,
  'D': 3.0,
  'F': 2.0
};

// Grade descriptions for UI
export const gradeDescriptions: Record<OperationalGrade, string> = {
  'A': 'Exceptional - Top-tier performance',
  'B': 'Strong - Above average performance',
  'C': 'Average - Standard market performance',
  'D': 'Below Average - Needs improvement',
  'F': 'Poor - Significant issues present'
};

// Value driver categories
export const valueDriverCategories = [
  'Financial Performance',
  'Customer Concentration',
  'Management Team',
  'Competitive Position',
  'Growth Prospects',
  'Systems & Processes',
  'Asset Quality',
  'Industry Outlook',
  'Risk Factors',
  'Owner Dependency'
] as const;