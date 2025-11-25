import { create } from "zustand";

interface WizardFormData {
  companyName?: string;
  businessType?: string;
  projectTitle?: string;
  projectDescription?: string;
  budget?: number;
  [key: string]: unknown;
}

interface WizardState {
  currentStep: number;
  totalSteps: number;
  formData: WizardFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<WizardFormData>) => void;
  resetWizard: () => void;
}

const initialFormData: WizardFormData = {};

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  totalSteps: 5,
  formData: initialFormData,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, state.totalSteps) 
  })),
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),
  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  resetWizard: () => set({ currentStep: 1, formData: initialFormData }),
}));
