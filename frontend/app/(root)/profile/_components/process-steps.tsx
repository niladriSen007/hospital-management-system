import { createElement } from "react";
import { Step } from "../_schema"
import { Check } from "lucide-react";

const ProcessSteps = ({ currentStep, steps }: {
  currentStep: number,
  steps: Step[]
}) => {
  return (
    <div className="flex mx-auto my-12">
      {
        steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                    ${isCompleted
                      ? "bg-green-500 text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs mt-2 font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[3px]  ${isCompleted ? "bg-green-400" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          )
        })
      }
    </div>
  )
}
export default ProcessSteps