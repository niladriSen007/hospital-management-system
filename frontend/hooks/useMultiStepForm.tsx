"use client"
import { addressInfoSchema, personalInfoSchema, Step, StepFormData } from "@/app/(root)/profile/_schema";
import { IconAddressBook } from "@tabler/icons-react";
import { User } from "lucide-react";
import { useState } from "react";

export const steps: Step[] = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "address", name: "Address Info", icon: IconAddressBook }
];

const stepSchemas = [
  personalInfoSchema,
  addressInfoSchema
];

export const useMultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileFormData, setProfileFormData] = useState<Partial<StepFormData>>({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getCurrentStepSchema = () => stepSchemas[currentStep];
  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep(prev => prev + 1);
  }
  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep(prev => prev - 1);
  }

  const updateFormData = (data: Partial<StepFormData>) => {
    setProfileFormData(prev => ({ ...prev, ...data }));
  }

  const submitForm = (data: StepFormData) => {
    console.log("✅ Final submitted data:", data);
    setIsSubmitted(true);
  };

  /** --- Reset the form entirely --- */
  const resetForm = () => {
    setProfileFormData({});
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    getCurrentStepSchema,
    goToNextStep,
    goToPreviousStep,
    profileFormData,
    updateFormData,
    submitForm,
    isSubmitted,
    resetForm,
    steps
  }
}