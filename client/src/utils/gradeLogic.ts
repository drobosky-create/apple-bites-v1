import { GRADE_DATA, GRADE_COLORS } from '@/data/valueMultipliers';

export { GRADE_DATA, GRADE_COLORS };

export type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

// Grade conversion utilities
export const gradeToNumber = (grade: OperationalGrade): number => {
  const mapping = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
  return mapping[grade];
};

export const numberToGrade = (num: number): OperationalGrade => {
  const mapping = [null, 'F', 'D', 'C', 'B', 'A'] as const;
  return mapping[Math.max(1, Math.min(5, Math.round(num)))] as OperationalGrade;
};

// Get multiplier for specific grade
export const getMultipleForGrade = (grade: OperationalGrade): number => {
  const gradeInfo = GRADE_DATA.find(g => g.grade === grade);
  return gradeInfo?.multiplier || 4.2;
};

// Calculate valuation based on EBITDA and grade
export const calculateValuation = (ebitda: number, grade: OperationalGrade): number => {
  return ebitda * getMultipleForGrade(grade);
};

// Get Argon Dashboard styling for grade
export const getGradientStyle = (
  grade: OperationalGrade, 
  isSelected: boolean, 
  isCurrent: boolean
): React.CSSProperties => {
  const colors = GRADE_COLORS[grade];
  
  if (isSelected) {
    return {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: 'white',
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    };
  }
  
  if (isCurrent) {
    return {
      background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
  }
  
  return {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
    color: '#344767',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.12)',
  };
};

// Format currency display
export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  } else {
    return `$${value.toLocaleString()}`;
  }
};

// Grade category information
export const getGradeCategory = (grade: OperationalGrade) => {
  const gradeInfo = GRADE_DATA.find(g => g.grade === grade);
  const colors = GRADE_COLORS[grade];
  
  return {
    label: gradeInfo?.label || 'Unknown',
    description: gradeInfo?.description || '',
    color: `text-[${colors.primary}]`,
    bgColor: `bg-[${colors.primary}]`
  };
};