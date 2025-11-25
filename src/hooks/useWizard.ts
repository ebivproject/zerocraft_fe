"use client";

import { useWizardStore } from "@/store/wizardStore";
import { useCallback } from "react";

export function useWizard() {
  const {
    currentStep,
    totalSteps,
    formData,
    setStep,
    nextStep,
    prevStep,
    updateFormData,
    resetWizard,
  } = useWizardStore();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setStep(step);
    }
  }, [setStep, totalSteps]);

  return {
    currentStep,
    totalSteps,
    formData,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
    resetWizard,
  };
}
