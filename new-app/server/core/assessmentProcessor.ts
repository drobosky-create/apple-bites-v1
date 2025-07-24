/**
 * Assessment Processing Service
 * 
 * Handles the complete processing pipeline for business valuations:
 * 1. Data validation and sanitization
 * 2. Valuation calculations
 * 3. Industry analysis integration
 * 4. Results compilation and storage
 */

import type { ValuationAssessment, InsertValuationAssessment, ValuationResult } from "../../shared/schema";
import { calculateValuation, validateFinancialData } from "./valuationEngine";
import { getIndustryAnalysis, getIndustryMultipliers } from "../data/naicsDatabase";

// ========================================
// PROCESSING PIPELINE
// ========================================

export interface ProcessingResult {
  success: boolean;
  assessment?: ValuationAssessment;
  valuationResult?: ValuationResult;
  errors?: string[];
  warnings?: string[];
}

/**
 * Main assessment processing function
 * Orchestrates the entire valuation calculation pipeline
 */
export async function processAssessment(
  assessmentData: InsertValuationAssessment
): Promise<ProcessingResult> {
  try {
    // Step 1: Validate input data
    const validation = validateAssessmentData(assessmentData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Step 2: Sanitize and normalize data
    const normalizedData = normalizeAssessmentData(assessmentData);

    // Step 3: Perform valuation calculations
    const valuationResult = calculateValuation(normalizedData as ValuationAssessment);

    // Step 4: Enhance with industry analysis
    const industryAnalysis = getIndustryAnalysis(normalizedData.naicsCode);

    // Step 5: Compile final assessment with calculated values
    const processedAssessment: ValuationAssessment = {
      ...normalizedData,
      id: 0, // Will be set by database
      
      // Calculated financial values
      baseEbitda: valuationResult.baseEbitda.toString(),
      adjustedEbitda: valuationResult.adjustedEbitda.toString(),
      valuationMultiple: valuationResult.valuationMultiple.toString(),
      lowEstimate: valuationResult.lowEstimate.toString(),
      midEstimate: valuationResult.midEstimate.toString(),
      highEstimate: valuationResult.highEstimate.toString(),
      overallScore: valuationResult.overallScore,

      // Processing metadata
      isProcessed: true,
      processingError: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      assessment: processedAssessment,
      valuationResult,
      warnings: validation.warnings
    };

  } catch (error) {
    return {
      success: false,
      errors: [`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// ========================================
// DATA VALIDATION
// ========================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Comprehensive validation of assessment input data
 */
function validateAssessmentData(data: InsertValuationAssessment): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Contact information validation
  if (!data.firstName?.trim()) errors.push("First name is required");
  if (!data.lastName?.trim()) errors.push("Last name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.company?.trim()) errors.push("Company name is required");
  if (!data.phone?.trim()) errors.push("Phone number is required");

  // Email format validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  // Financial data validation
  const requiredFinancialFields = [
    'netIncome', 'interest', 'taxes', 'depreciation', 'amortization'
  ] as const;

  requiredFinancialFields.forEach(field => {
    const value = data[field];
    if (value === null || value === undefined || value === '') {
      errors.push(`${field} is required`);
    } else {
      const numValue = parseFloat(value.toString());
      if (isNaN(numValue)) {
        errors.push(`${field} must be a valid number`);
      }
    }
  });

  // Value driver validation
  const valueDriverFields = [
    'financialPerformance', 'customerConcentration', 'managementTeam', 
    'competitivePosition', 'growthProspects', 'systemsProcesses',
    'assetQuality', 'industryOutlook', 'riskFactors', 'ownerDependency'
  ] as const;

  const validGrades = ['A', 'B', 'C', 'D', 'F'];
  valueDriverFields.forEach(field => {
    const grade = data[field];
    if (!grade || !validGrades.includes(grade)) {
      errors.push(`${field} must have a valid grade (A, B, C, D, or F)`);
    }
  });

  // Follow-up intent validation
  if (!data.followUpIntent || !['yes', 'maybe', 'no'].includes(data.followUpIntent)) {
    errors.push("Follow-up intent must be 'yes', 'maybe', or 'no'");
  }

  // Business logic warnings
  const netIncome = parseFloat(data.netIncome?.toString() || '0');
  const adjustedEbitda = netIncome + 
    parseFloat(data.interest?.toString() || '0') +
    parseFloat(data.taxes?.toString() || '0') +
    parseFloat(data.depreciation?.toString() || '0') +
    parseFloat(data.amortization?.toString() || '0') +
    parseFloat(data.ownerSalary?.toString() || '0') +
    parseFloat(data.personalExpenses?.toString() || '0') +
    parseFloat(data.oneTimeExpenses?.toString() || '0') +
    parseFloat(data.otherAdjustments?.toString() || '0');

  if (adjustedEbitda <= 0) {
    warnings.push("Adjusted EBITDA is negative or zero, which may result in unrealistic valuations");
  }

  if (netIncome < 0 && adjustedEbitda > 0) {
    warnings.push("Company shows losses but positive EBITDA after adjustments");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ========================================
// DATA NORMALIZATION
// ========================================

/**
 * Normalize and sanitize assessment data for processing
 */
function normalizeAssessmentData(data: InsertValuationAssessment): InsertValuationAssessment {
  return {
    ...data,
    
    // Normalize text fields
    firstName: data.firstName?.trim() || '',
    lastName: data.lastName?.trim() || '',
    email: data.email?.toLowerCase().trim() || '',
    company: data.company?.trim() || '',
    phone: data.phone?.trim() || '',
    jobTitle: data.jobTitle?.trim() || undefined,
    
    // Normalize financial fields to ensure decimal precision
    netIncome: normalizeDecimalField(data.netIncome),
    interest: normalizeDecimalField(data.interest),
    taxes: normalizeDecimalField(data.taxes),
    depreciation: normalizeDecimalField(data.depreciation),
    amortization: normalizeDecimalField(data.amortization),
    ownerSalary: normalizeDecimalField(data.ownerSalary, '0'),
    personalExpenses: normalizeDecimalField(data.personalExpenses, '0'),
    oneTimeExpenses: normalizeDecimalField(data.oneTimeExpenses, '0'),
    otherAdjustments: normalizeDecimalField(data.otherAdjustments, '0'),
    
    // Normalize grades
    financialPerformance: data.financialPerformance?.toUpperCase() || 'C',
    customerConcentration: data.customerConcentration?.toUpperCase() || 'C',
    managementTeam: data.managementTeam?.toUpperCase() || 'C',
    competitivePosition: data.competitivePosition?.toUpperCase() || 'C',
    growthProspects: data.growthProspects?.toUpperCase() || 'C',
    systemsProcesses: data.systemsProcesses?.toUpperCase() || 'C',
    assetQuality: data.assetQuality?.toUpperCase() || 'C',
    industryOutlook: data.industryOutlook?.toUpperCase() || 'C',
    riskFactors: data.riskFactors?.toUpperCase() || 'C',
    ownerDependency: data.ownerDependency?.toUpperCase() || 'C',

    // Normalize NAICS code
    naicsCode: data.naicsCode?.trim() || undefined,
    
    // Normalize follow-up intent
    followUpIntent: data.followUpIntent?.toLowerCase() || 'maybe',
    
    // Clean up text fields
    adjustmentNotes: data.adjustmentNotes?.trim() || undefined,
    additionalComments: data.additionalComments?.trim() || undefined,
  };
}

/**
 * Normalize decimal field values
 */
function normalizeDecimalField(value: any, defaultValue?: string): string {
  if (value === null || value === undefined || value === '') {
    return defaultValue || '0';
  }
  
  const numValue = parseFloat(value.toString());
  if (isNaN(numValue)) {
    return defaultValue || '0';
  }
  
  // Round to 2 decimal places for currency values
  return numValue.toFixed(2);
}

// ========================================
// RESULT COMPILATION
// ========================================

/**
 * Generate summary statistics for the assessment
 */
export function generateAssessmentSummary(assessment: ValuationAssessment): {
  businessOverview: string;
  financialSummary: string;
  valueDriverSummary: string;
  industryContext: string;
} {
  const baseEbitda = parseFloat(assessment.baseEbitda?.toString() || '0');
  const adjustedEbitda = parseFloat(assessment.adjustedEbitda?.toString() || '0');
  const midEstimate = parseFloat(assessment.midEstimate?.toString() || '0');
  
  const businessOverview = `${assessment.company} is a ${assessment.industryDescription || 'business'} ` +
    `founded in ${assessment.foundingYear || 'unknown year'} with an estimated value of ` +
    `$${midEstimate.toLocaleString()}.`;

  const adjustmentAmount = adjustedEbitda - baseEbitda;
  const financialSummary = `Base EBITDA of $${baseEbitda.toLocaleString()} was adjusted by ` +
    `$${Math.abs(adjustmentAmount).toLocaleString()} to reach an adjusted EBITDA of ` +
    `$${adjustedEbitda.toLocaleString()}.`;

  const valueDriverSummary = `Overall business grade: ${assessment.overallScore}. ` +
    `Key strengths and areas for improvement identified across 10 value drivers.`;

  const industryAnalysis = getIndustryAnalysis(assessment.naicsCode || undefined);
  const industryContext = `Industry: ${industryAnalysis.title}. ` +
    `Risk Level: ${industryAnalysis.riskLevel}. Growth Outlook: ${industryAnalysis.growthOutlook}.`;

  return {
    businessOverview,
    financialSummary,
    valueDriverSummary,
    industryContext
  };
}

// ========================================
// EXPORTS
// ========================================

export {
  processAssessment,
  generateAssessmentSummary,
};