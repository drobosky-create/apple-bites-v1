import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ValuationAssessment } from '@shared/schema';
import { OperationalGrade } from '@/utils/gradeLogic';

interface ValuationState {
  // Current assessment data
  currentAssessment: ValuationAssessment | null;
  
  // Grade selection state - centralized
  selectedGrade: OperationalGrade;
  baseGrade: OperationalGrade;
  
  // UI state
  isLoading: boolean;
  showAdvancedOptions: boolean;
}

interface ValuationContextType extends ValuationState {
  // Actions
  setCurrentAssessment: (assessment: ValuationAssessment | null) => void;
  setSelectedGrade: (grade: OperationalGrade) => void;
  setIsLoading: (loading: boolean) => void;
  setShowAdvancedOptions: (show: boolean) => void;
  
  // Computed values
  getCurrentEBITDA: () => number;
  getCurrentValuation: () => number;
  getProjectedValuation: () => number;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ValuationState>({
    currentAssessment: null,
    selectedGrade: 'C',
    baseGrade: 'C',
    isLoading: false,
    showAdvancedOptions: false,
  });

  const updateState = (updates: Partial<ValuationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setCurrentAssessment = (assessment: ValuationAssessment | null) => {
    updateState({ 
      currentAssessment: assessment,
      baseGrade: assessment?.overallScore?.charAt(0) as OperationalGrade || 'C'
    });
  };

  const setSelectedGrade = (grade: OperationalGrade) => {
    updateState({ selectedGrade: grade });
  };

  const setIsLoading = (loading: boolean) => {
    updateState({ isLoading: loading });
  };

  const setShowAdvancedOptions = (show: boolean) => {
    updateState({ showAdvancedOptions: show });
  };

  // Helper functions to calculate values
  const getCurrentEBITDA = (): number => {
    if (!state.currentAssessment) return 0;
    return state.currentAssessment.adjustedEBITDA || 0;
  };

  const getCurrentValuation = (): number => {
    if (!state.currentAssessment) return 0;
    return state.currentAssessment.valuationEstimate || 0;
  };

  const getProjectedValuation = (): number => {
    // This would use the grade logic to calculate projected value
    const ebitda = getCurrentEBITDA();
    const multipliers = { 'A': 7.5, 'B': 5.7, 'C': 4.2, 'D': 3.0, 'F': 2.0 };
    return ebitda * (multipliers[state.selectedGrade] || 4.2);
  };

  const contextValue: ValuationContextType = {
    ...state,
    setCurrentAssessment,
    setSelectedGrade,
    setIsLoading,
    setShowAdvancedOptions,
    getCurrentEBITDA,
    getCurrentValuation,
    getProjectedValuation,
  };

  return (
    <ValuationContext.Provider value={contextValue}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}