/**
 * Core Business Valuation Engine
 * 
 * This is the heart of the business valuation platform, containing all the 
 * critical business logic for calculating accurate company valuations.
 */

import type { ValuationAssessment, ValueDriverScores, ValuationResult } from "../../shared/schema";

// ========================================
// GRADE TO MULTIPLIER CONVERSION
// ========================================

/**
 * Convert letter grades to numerical multipliers for valuation calculations
 * These multipliers are based on industry standard practices
 */
const gradeToMultiplier: Record<string, number> = {
  'A': 1.25,  // Excellent: 25% premium
  'B': 1.10,  // Good: 10% premium  
  'C': 1.00,  // Average: baseline multiplier
  'D': 0.85,  // Below Average: 15% discount
  'F': 0.70,  // Poor: 30% discount
};

/**
 * Convert grades to descriptive labels for reporting
 */
const gradeToLabel: Record<string, string> = {
  'A': 'Excellent',
  'B': 'Good', 
  'C': 'Average',
  'D': 'Below Average',
  'F': 'Poor'
};

// ========================================
// EBITDA CALCULATION FUNCTIONS
// ========================================

/**
 * Calculate base EBITDA from financial components
 * EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization
 */
function calculateBaseEbitda(assessment: ValuationAssessment): number {
  const netIncome = parseFloat(assessment.netIncome?.toString() || '0');
  const interest = parseFloat(assessment.interest?.toString() || '0');
  const taxes = parseFloat(assessment.taxes?.toString() || '0');
  const depreciation = parseFloat(assessment.depreciation?.toString() || '0');
  const amortization = parseFloat(assessment.amortization?.toString() || '0');
  
  return netIncome + interest + taxes + depreciation + amortization;
}

/**
 * Calculate adjusted EBITDA with owner-specific adjustments
 * This normalizes the business for a potential buyer
 */
function calculateAdjustedEbitda(assessment: ValuationAssessment, baseEbitda: number): number {
  const ownerSalary = parseFloat(assessment.ownerSalary?.toString() || '0');
  const personalExpenses = parseFloat(assessment.personalExpenses?.toString() || '0');
  const oneTimeExpenses = parseFloat(assessment.oneTimeExpenses?.toString() || '0');
  const otherAdjustments = parseFloat(assessment.otherAdjustments?.toString() || '0');
  
  const totalAdjustments = ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;
  
  return baseEbitda + totalAdjustments;
}

// ========================================
// VALUE DRIVER ANALYSIS
// ========================================

/**
 * Extract value driver scores from assessment
 */
function getValueDriverScores(assessment: ValuationAssessment): ValueDriverScores {
  return {
    financialPerformance: assessment.financialPerformance,
    customerConcentration: assessment.customerConcentration,
    managementTeam: assessment.managementTeam,
    competitivePosition: assessment.competitivePosition,
    growthProspects: assessment.growthProspects,
    systemsProcesses: assessment.systemsProcesses,
    assetQuality: assessment.assetQuality,
    industryOutlook: assessment.industryOutlook,
    riskFactors: assessment.riskFactors,
    ownerDependency: assessment.ownerDependency,
  };
}

/**
 * Calculate weighted average multiplier based on value driver grades
 * Each value driver has equal weight in the calculation
 */
function calculateWeightedMultiplier(valueDrivers: ValueDriverScores): number {
  const scores = Object.values(valueDrivers);
  const totalMultiplier = scores.reduce((sum, grade) => {
    return sum + (gradeToMultiplier[grade] || 1.0);
  }, 0);
  
  return totalMultiplier / scores.length;
}

/**
 * Calculate overall business grade from value driver scores
 */
function calculateOverallGrade(valueDrivers: ValueDriverScores): string {
  const weightedMultiplier = calculateWeightedMultiplier(valueDrivers);
  
  // Convert weighted multiplier back to grade
  if (weightedMultiplier >= 1.20) return 'A';
  if (weightedMultiplier >= 1.05) return 'B';
  if (weightedMultiplier >= 0.95) return 'C';
  if (weightedMultiplier >= 0.80) return 'D';
  return 'F';
}

/**
 * Get detailed breakdown of each value driver's contribution
 */
function getGradeBreakdown(valueDrivers: ValueDriverScores): Record<string, { grade: string; multiplier: number }> {
  const breakdown: Record<string, { grade: string; multiplier: number }> = {};
  
  Object.entries(valueDrivers).forEach(([key, grade]) => {
    breakdown[key] = {
      grade,
      multiplier: gradeToMultiplier[grade] || 1.0
    };
  });
  
  return breakdown;
}

// ========================================
// INDUSTRY MULTIPLIER APPLICATION
// ========================================

/**
 * Get industry baseline multiplier from NAICS code
 * TODO: Integrate with NAICS database when available
 */
function getIndustryMultiplier(naicsCode?: string): { min: number; avg: number; max: number } {
  // Default industry multipliers - will be replaced with NAICS database lookup
  const defaultMultipliers = {
    min: 2.0,
    avg: 3.5,
    max: 5.0
  };
  
  // TODO: Implement NAICS database lookup
  // const naicsData = await getNAICSMultiplier(naicsCode);
  // return naicsData || defaultMultipliers;
  
  return defaultMultipliers;
}

/**
 * Apply value driver adjustments to industry multipliers
 */
function applyValueDriverAdjustments(
  industryMultipliers: { min: number; avg: number; max: number },
  valueDriverMultiplier: number
): { min: number; avg: number; max: number } {
  return {
    min: industryMultipliers.min * valueDriverMultiplier,
    avg: industryMultipliers.avg * valueDriverMultiplier,
    max: industryMultipliers.max * valueDriverMultiplier,
  };
}

// ========================================
// COMPLETE VALUATION CALCULATION
// ========================================

/**
 * Main valuation calculation function that brings everything together
 */
function calculateValuation(assessment: ValuationAssessment): ValuationResult {
  // Step 1: Calculate EBITDA
  const baseEbitda = calculateBaseEbitda(assessment);
  const adjustedEbitda = calculateAdjustedEbitda(assessment, baseEbitda);
  
  // Step 2: Analyze Value Drivers
  const valueDrivers = getValueDriverScores(assessment);
  const valueDriverMultiplier = calculateWeightedMultiplier(valueDrivers);
  const overallScore = calculateOverallGrade(valueDrivers);
  const gradeBreakdown = getGradeBreakdown(valueDrivers);
  
  // Step 3: Get Industry Multipliers
  const industryMultipliers = getIndustryMultiplier(assessment.naicsCode || undefined);
  const adjustedMultipliers = applyValueDriverAdjustments(industryMultipliers, valueDriverMultiplier);
  
  // Step 4: Calculate Final Valuations
  const lowEstimate = Math.round(adjustedEbitda * adjustedMultipliers.min);
  const midEstimate = Math.round(adjustedEbitda * adjustedMultipliers.avg);
  const highEstimate = Math.round(adjustedEbitda * adjustedMultipliers.max);
  
  return {
    baseEbitda,
    adjustedEbitda,
    valuationMultiple: adjustedMultipliers.avg,
    lowEstimate,
    midEstimate,
    highEstimate,
    overallScore,
    gradeBreakdown,
  };
}

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Validate that all required financial data is present and valid
 */
function validateFinancialData(assessment: ValuationAssessment): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required EBITDA components
  const requiredFields = ['netIncome', 'interest', 'taxes', 'depreciation', 'amortization'] as const;
  
  requiredFields.forEach(field => {
    const value = assessment[field];
    if (value === null || value === undefined) {
      errors.push(`${field} is required`);
    } else {
      const numValue = parseFloat(value.toString());
      if (isNaN(numValue)) {
        errors.push(`${field} must be a valid number`);
      }
    }
  });
  
  // Check value driver grades
  const valueDrivers = getValueDriverScores(assessment);
  Object.entries(valueDrivers).forEach(([key, grade]) => {
    if (!['A', 'B', 'C', 'D', 'F'].includes(grade)) {
      errors.push(`${key} must have a valid grade (A-F)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format currency values for display
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage values for display
 */
function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// ========================================
// EXPORTS
// ========================================

export {
  // EBITDA Calculations
  calculateBaseEbitda,
  calculateAdjustedEbitda,
  
  // Value Driver Analysis
  getValueDriverScores,
  calculateWeightedMultiplier,
  calculateOverallGrade,
  getGradeBreakdown,
  
  // Industry Analysis
  getIndustryMultiplier,
  applyValueDriverAdjustments,
  
  // Main Calculation
  calculateValuation,
  
  // Validation & Formatting
  validateFinancialData,
  formatCurrency,
  formatPercentage,
  
  // Constants
  gradeToMultiplier,
  gradeToLabel,
};