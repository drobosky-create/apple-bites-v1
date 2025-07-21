// Centralized utilities for state management cleanup
// This file consolidates common patterns to eliminate redundant useState calls

import { useState, useCallback } from 'react';

// Generic loading state manager
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const withLoading = useCallback(async (asyncFn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, withLoading };
}

// Generic error state manager
export function useErrorState(initialError: string | null = null) {
  const [error, setError] = useState<string | null>(initialError);
  
  const clearError = useCallback(() => setError(null), []);
  
  return { error, setError, clearError };
}

// Boolean toggle state (for modals, visibility, etc.)
export function useToggleState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle, setIsOpen };
}

// Form validation state consolidation
export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const addError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);
  
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  const clearAllErrors = useCallback(() => setErrors({}), []);
  
  return { errors, addError, clearError, clearAllErrors };
}

// Multi-step form state manager
export function useStepState<T extends string>(steps: T[], initialStep: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep);
  const [visitedSteps, setVisitedSteps] = useState<Set<T>>(new Set([initialStep]));
  
  const goToStep = useCallback((step: T) => {
    setCurrentStep(step);
    setVisitedSteps(prev => new Set([...Array.from(prev), step]));
  }, []);
  
  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  }, [currentStep, steps, goToStep]);
  
  const prevStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  }, [currentStep, steps, goToStep]);
  
  return {
    currentStep,
    visitedSteps,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === steps[0],
    isLastStep: currentStep === steps[steps.length - 1],
  };
}

// Selection state for lists/arrays
export function useSelectionState<T>(initialSelection: T[] = []) {
  const [selected, setSelected] = useState<T[]>(initialSelection);
  
  const toggleSelection = useCallback((item: T) => {
    setSelected(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);
  
  const selectItem = useCallback((item: T) => {
    setSelected(prev => prev.includes(item) ? prev : [...prev, item]);
  }, []);
  
  const deselectItem = useCallback((item: T) => {
    setSelected(prev => prev.filter(i => i !== item));
  }, []);
  
  const clearSelection = useCallback(() => setSelected([]), []);
  
  return {
    selected,
    toggleSelection,
    selectItem,
    deselectItem,
    clearSelection,
    isSelected: (item: T) => selected.includes(item),
  };
}