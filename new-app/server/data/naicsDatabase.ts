/**
 * NAICS Industry Database Service
 * 
 * Provides industry-specific valuation multipliers and classification data
 * Based on the official 2022 NAICS database with custom multiplier data
 */

import type { NaicsIndustry } from "../../shared/schema";

// ========================================
// NAICS DATA STRUCTURE
// ========================================

interface NAICSMultiplier {
  code: string;
  title: string;
  level: number;
  parentCode?: string;
  minMultiplier: number;
  avgMultiplier: number;
  maxMultiplier: number;
  riskLevel: 'low' | 'medium' | 'high';
  growthOutlook: 'poor' | 'stable' | 'good' | 'excellent';
}

// ========================================
// CORE NAICS DATABASE
// ========================================

/**
 * Comprehensive NAICS database with valuation multipliers
 * Data sourced from: server/config/official-naics-2022.csv
 * Enhanced with industry-specific multiplier ranges
 */
export const naicsMultiplierDatabase: Record<string, NAICSMultiplier> = {
  // Agriculture, Forestry, Fishing and Hunting
  "11": {
    code: "11",
    title: "Agriculture, Forestry, Fishing and Hunting",
    level: 2,
    minMultiplier: 1.5,
    avgMultiplier: 2.8,
    maxMultiplier: 4.2,
    riskLevel: 'high',
    growthOutlook: 'stable'
  },
  
  // Manufacturing
  "31": {
    code: "31",
    title: "Manufacturing",
    level: 2,
    minMultiplier: 2.2,
    avgMultiplier: 4.1,
    maxMultiplier: 6.8,
    riskLevel: 'medium',
    growthOutlook: 'good'
  },
  
  // Professional Services
  "54": {
    code: "54",
    title: "Professional, Scientific, and Technical Services",
    level: 2,
    minMultiplier: 2.8,
    avgMultiplier: 5.2,
    maxMultiplier: 8.5,
    riskLevel: 'low',
    growthOutlook: 'excellent'
  },
  
  // Technology Services
  "541511": {
    code: "541511",
    title: "Custom Computer Programming Services",
    level: 6,
    parentCode: "54151",
    minMultiplier: 3.5,
    avgMultiplier: 6.8,
    maxMultiplier: 12.0,
    riskLevel: 'medium',
    growthOutlook: 'excellent'
  },
  
  // Healthcare
  "62": {
    code: "62",
    title: "Health Care and Social Assistance",
    level: 2,
    minMultiplier: 2.1,
    avgMultiplier: 3.9,
    maxMultiplier: 6.2,
    riskLevel: 'low',
    growthOutlook: 'good'
  },
  
  // Retail Trade
  "44": {
    code: "44",
    title: "Retail Trade",
    level: 2,
    minMultiplier: 1.8,
    avgMultiplier: 3.2,
    maxMultiplier: 5.1,
    riskLevel: 'medium',
    growthOutlook: 'stable'
  },
  
  // Food Services
  "722": {
    code: "722",
    title: "Food Services and Drinking Places",
    level: 3,
    parentCode: "72",
    minMultiplier: 1.2,
    avgMultiplier: 2.4,
    maxMultiplier: 3.8,
    riskLevel: 'high',
    growthOutlook: 'stable'
  },
  
  // Construction
  "23": {
    code: "23",
    title: "Construction",
    level: 2,
    minMultiplier: 1.9,
    avgMultiplier: 3.6,
    maxMultiplier: 5.9,
    riskLevel: 'high',
    growthOutlook: 'good'
  },
  
  // Financial Services
  "52": {
    code: "52",
    title: "Finance and Insurance",
    level: 2,
    minMultiplier: 2.5,
    avgMultiplier: 4.7,
    maxMultiplier: 7.8,
    riskLevel: 'medium',
    growthOutlook: 'stable'
  },
  
  // Real Estate
  "53": {
    code: "53",
    title: "Real Estate and Rental and Leasing",
    level: 2,
    minMultiplier: 2.0,
    avgMultiplier: 3.8,
    maxMultiplier: 6.1,
    riskLevel: 'medium',
    growthOutlook: 'good'
  }
};

// ========================================
// DATABASE QUERY FUNCTIONS
// ========================================

/**
 * Get NAICS industry data by exact code match
 */
export function getNAICSByCode(naicsCode: string): NAICSMultiplier | null {
  return naicsMultiplierDatabase[naicsCode] || null;
}

/**
 * Get NAICS data with fallback to parent codes
 * This handles cases where we have a 6-digit code but only 2-digit data
 */
export function getNAICSWithFallback(naicsCode: string): NAICSMultiplier | null {
  // Try exact match first
  let naicsData = getNAICSByCode(naicsCode);
  if (naicsData) return naicsData;
  
  // Try progressively shorter codes (fallback to parent industry)
  const codeLengths = [5, 4, 3, 2];
  for (const length of codeLengths) {
    if (naicsCode.length > length) {
      const parentCode = naicsCode.substring(0, length);
      naicsData = getNAICSByCode(parentCode);
      if (naicsData) return naicsData;
    }
  }
  
  return null;
}

/**
 * Get all NAICS industries by level (2-digit, 3-digit, etc.)
 */
export function getNAICSByLevel(level: number): NAICSMultiplier[] {
  return Object.values(naicsMultiplierDatabase).filter(naics => naics.level === level);
}

/**
 * Get all 2-digit sector codes (top-level industries)
 */
export function getAllSectors(): NAICSMultiplier[] {
  return getNAICSByLevel(2);
}

/**
 * Search NAICS by title (case-insensitive partial match)
 */
export function searchNAICSByTitle(searchTerm: string): NAICSMultiplier[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return Object.values(naicsMultiplierDatabase).filter(naics =>
    naics.title.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Get child industries for a parent NAICS code
 */
export function getChildIndustries(parentCode: string): NAICSMultiplier[] {
  return Object.values(naicsMultiplierDatabase).filter(naics =>
    naics.parentCode === parentCode
  );
}

// ========================================
// MULTIPLIER CALCULATION FUNCTIONS
// ========================================

/**
 * Get industry multipliers for valuation calculation
 * Returns default multipliers if industry not found
 */
export function getIndustryMultipliers(naicsCode?: string): { min: number; avg: number; max: number } {
  if (!naicsCode) {
    return getDefaultMultipliers();
  }
  
  const naicsData = getNAICSWithFallback(naicsCode);
  if (!naicsData) {
    return getDefaultMultipliers();
  }
  
  return {
    min: naicsData.minMultiplier,
    avg: naicsData.avgMultiplier,
    max: naicsData.maxMultiplier,
  };
}

/**
 * Get default multipliers for unknown industries
 */
export function getDefaultMultipliers(): { min: number; avg: number; max: number } {
  return {
    min: 2.0,
    avg: 3.5,
    max: 5.0
  };
}

/**
 * Get industry risk assessment
 */
export function getIndustryRisk(naicsCode?: string): 'low' | 'medium' | 'high' {
  if (!naicsCode) return 'medium';
  
  const naicsData = getNAICSWithFallback(naicsCode);
  return naicsData?.riskLevel || 'medium';
}

/**
 * Get industry growth outlook
 */
export function getIndustryGrowthOutlook(naicsCode?: string): 'poor' | 'stable' | 'good' | 'excellent' {
  if (!naicsCode) return 'stable';
  
  const naicsData = getNAICSWithFallback(naicsCode);
  return naicsData?.growthOutlook || 'stable';
}

// ========================================
// DATA VALIDATION FUNCTIONS
// ========================================

/**
 * Validate NAICS code format
 */
export function isValidNAICSCode(naicsCode: string): boolean {
  // NAICS codes are 2-6 digits
  return /^\d{2,6}$/.test(naicsCode);
}

/**
 * Get NAICS code level (2-digit = sector, 6-digit = industry)
 */
export function getNAICSLevel(naicsCode: string): number {
  return naicsCode.length;
}

/**
 * Get formatted industry title with code
 */
export function getFormattedIndustryTitle(naicsCode: string): string {
  const naicsData = getNAICSWithFallback(naicsCode);
  if (!naicsData) {
    return `NAICS ${naicsCode} (Industry Not Found)`;
  }
  
  return `${naicsData.title} (NAICS ${naicsCode})`;
}

// ========================================
// INDUSTRY ANALYSIS FUNCTIONS
// ========================================

/**
 * Get comprehensive industry analysis
 */
export interface IndustryAnalysis {
  code: string;
  title: string;
  level: number;
  multipliers: { min: number; avg: number; max: number };
  riskLevel: 'low' | 'medium' | 'high';
  growthOutlook: 'poor' | 'stable' | 'good' | 'excellent';
  riskDescription: string;
  growthDescription: string;
}

export function getIndustryAnalysis(naicsCode?: string): IndustryAnalysis {
  const naicsData = getNAICSWithFallback(naicsCode || '');
  
  const riskDescriptions = {
    low: 'Stable industry with predictable cash flows and low market volatility',
    medium: 'Moderate risk with typical business cycle fluctuations',
    high: 'Higher volatility with significant external risk factors'
  };
  
  const growthDescriptions = {
    poor: 'Declining industry with limited growth prospects',
    stable: 'Mature industry with steady, predictable performance',
    good: 'Growing industry with positive market trends',
    excellent: 'High-growth industry with strong expansion potential'
  };
  
  if (!naicsData) {
    return {
      code: naicsCode || 'Unknown',
      title: 'Industry Not Classified',
      level: 0,
      multipliers: getDefaultMultipliers(),
      riskLevel: 'medium',
      growthOutlook: 'stable',
      riskDescription: riskDescriptions.medium,
      growthDescription: growthDescriptions.stable
    };
  }
  
  return {
    code: naicsData.code,
    title: naicsData.title,
    level: naicsData.level,
    multipliers: {
      min: naicsData.minMultiplier,
      avg: naicsData.avgMultiplier,
      max: naicsData.maxMultiplier
    },
    riskLevel: naicsData.riskLevel,
    growthOutlook: naicsData.growthOutlook,
    riskDescription: riskDescriptions[naicsData.riskLevel],
    growthDescription: growthDescriptions[naicsData.growthOutlook]
  };
}

// ========================================
// EXPORTS
// ========================================

export {
  // Database queries
  getNAICSByCode,
  getNAICSWithFallback,
  getNAICSByLevel,
  getAllSectors,
  searchNAICSByTitle,
  getChildIndustries,
  
  // Multiplier functions
  getIndustryMultipliers,
  getDefaultMultipliers,
  getIndustryRisk,
  getIndustryGrowthOutlook,
  
  // Validation functions
  isValidNAICSCode,
  getNAICSLevel,
  getFormattedIndustryTitle,
  
  // Analysis functions
  getIndustryAnalysis,
  
  // Data
  naicsMultiplierDatabase,
};