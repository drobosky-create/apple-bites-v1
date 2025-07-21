// Centralized grade logic utilities - moved from scattered components
export type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

// Grade scoring utilities (consolidated from value-drivers-heatmap.tsx)
export function getGradeScore(grade: string): number {
  const gradeMap: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
  return gradeMap[grade] || 3;
}

// Grade styling utilities (consolidated from multiple components)
export function getGradeColor(grade: OperationalGrade): string {
  const colorMap: Record<OperationalGrade, string> = {
    'A': 'bg-green-500 hover:bg-green-600',
    'B': 'bg-blue-500 hover:bg-blue-600', 
    'C': 'bg-slate-500 hover:bg-slate-600',
    'D': 'bg-orange-500 hover:bg-orange-600',
    'F': 'bg-red-500 hover:bg-red-600'
  };
  return colorMap[grade];
}

export function getGradeBorderColor(grade: OperationalGrade): string {
  const borderMap: Record<OperationalGrade, string> = {
    'A': 'border-green-600',
    'B': 'border-blue-600',
    'C': 'border-slate-600', 
    'D': 'border-orange-600',
    'F': 'border-red-600'
  };
  return borderMap[grade];
}

// Gradient styling for interactive elements
export function getGradientStyle(selectedGrade: OperationalGrade, currentGrade: OperationalGrade): string {
  if (selectedGrade === currentGrade) {
    return 'from-purple-400 via-blue-500 to-blue-800';
  }
  return 'from-gray-300 to-gray-500';
}

// Currency formatting utility
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}