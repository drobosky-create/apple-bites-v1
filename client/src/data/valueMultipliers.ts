// Static data for grade values and multipliers
export interface GradeData {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  multiple: string;
  label: string;
  description: string;
  multiplier: number;
}

export const GRADE_DATA: GradeData[] = [
  {
    grade: 'A',
    multiple: '7.5x',
    label: 'Excellent',
    description: 'Industry-leading operations with exceptional systems and processes',
    multiplier: 7.5
  },
  {
    grade: 'B', 
    multiple: '5.7x',
    label: 'Good',
    description: 'Strong operational foundation with well-developed systems',
    multiplier: 5.7
  },
  {
    grade: 'C',
    multiple: '4.2x', 
    label: 'Average',
    description: 'Adequate operations meeting basic industry standards',
    multiplier: 4.2
  },
  {
    grade: 'D',
    multiple: '3.0x',
    label: 'Needs Work',
    description: 'Operations requiring improvement to meet market standards',
    multiplier: 3.0
  },
  {
    grade: 'F',
    multiple: '2.0x',
    label: 'At Risk', 
    description: 'Critical operational issues requiring immediate attention',
    multiplier: 2.0
  }
];

// Argon Dashboard color themes for grades
export const GRADE_COLORS = {
  A: { primary: '#2dce89', secondary: '#11cdef', accent: '#5e72e4' },
  B: { primary: '#11cdef', secondary: '#2dce89', accent: '#5e72e4' },
  C: { primary: '#5e72e4', secondary: '#8392ab', accent: '#344767' },
  D: { primary: '#fb6340', secondary: '#f5365c', accent: '#8392ab' },
  F: { primary: '#f5365c', secondary: '#fb6340', accent: '#8392ab' }
} as const;