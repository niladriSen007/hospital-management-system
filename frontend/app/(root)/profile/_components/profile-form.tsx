"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { StepFormData } from "../_schema"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useEffect } from "react"
import PersonalInfoForm from "./personal-info-form"
import AddressInfoForm from "./address-info-form"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ProcessSteps from "./process-steps"

const ProfileForm = () => {

  const { getCurrentStepSchema,
    profileFormData,
    currentStep,
    goToPreviousStep,
    goToNextStep,
    isFirstStep,
    isLastStep,
    updateFormData,
    submitForm,
    isSubmitted,
    resetForm,
    steps
  } = useMultiStepForm();

  const { reset, control, handleSubmit, trigger } = useForm<StepFormData>({
    resolver: zodResolver(getCurrentStepSchema()),
    defaultValues: profileFormData,
    mode: "onChange"
  })

  const onPrevious = () => goToPreviousStep();

  const onNext = async (data: StepFormData) => {
    const isStepValid = await trigger();
    if (!isStepValid) return;

    const updatedData = { ...profileFormData, ...data };
    updateFormData(updatedData);

    if (isLastStep) {
      submitForm(updatedData);
      console.log("✅ Final submitted data:", updatedData);
    } else {
      goToNextStep();
    }
  }

  useEffect(() => {
    reset(profileFormData)
  }, [currentStep, profileFormData, reset])


  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div
          aria-hidden
          className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
        >
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        <Card className="w-full max-w-lg text-center border-gray-800 bg-black/50 backdrop-blur-sm">
          <CardContent className="pt-12 pb-8 px-8">
            {/* Success icon - animated checkmark */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/30">
              <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>

            <h2 className="text-3xl text-green-600 font-bold mb-3 tracking-tight">Profile Updated Successfully!</h2>
            <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
              Your profile information has been saved and updated in our system.
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button onClick={resetForm} className="w-full h-11 text-base" size="lg">
                Update Profile Again
              </Button>
              <Button variant="outline" className="w-full h-11 text-base border-gray-700 hover:bg-gray-900" size="lg">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto ">
        <ProcessSteps {...{ currentStep, steps }} />
      </div>
      {currentStep === 0 && <div><PersonalInfoForm {...{ control }} /></div>}
      {currentStep === 1 && <div><AddressInfoForm {...{ control }} /></div>}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Previous</span>
        </Button>

        <Button type="button" onClick={handleSubmit(onNext)}>
          {isLastStep ? "Submit" : "Next"}
          {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
export default ProfileForm