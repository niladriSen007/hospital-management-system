import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Calendar, User2 } from "lucide-react"
import { Control, Controller } from "react-hook-form"
import { StepFormData } from "../_schema"

const PersonalInfoForm = ({ control }: {
  control: Control<StepFormData, any, StepFormData>
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
        <p className="text-muted-foreground text-sm">Please provide your personal details below</p>
      </div>

      <div className="space-y-5">
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field className="">
              {/* <FieldLabel htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </FieldLabel> */}
              <InputGroup>
                <InputGroupInput
                  placeholder="+1 (555) 000-0000"
                  aria-invalid={fieldState.invalid}
                  id="phone"
                  type="tel"
                  {...field}
                  className={`w-full text-base transition-all `}
                />
                <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                  <Phone className="h-5 w-5" />
                </InputGroupAddon>
              </InputGroup>
              <div className=" ">
                {fieldState.error && (
                  <p className="text-red-500 leading-5 font-medium   animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="age"
          render={({ field, fieldState }) => (
            <Field className="">
              {/*  <FieldLabel htmlFor="age" className="text-sm font-medium">
                Age
              </FieldLabel> */}
              <InputGroup>
                <InputGroupInput
                  placeholder="Enter your age"
                  aria-invalid={fieldState.invalid}
                  id="age"
                  type="number"
                  {...field}
                  className={`w-full text-base transition-all `}
                />
                <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                  <Calendar className="h-5 w-5" />
                </InputGroupAddon>
              </InputGroup>
              <div className="">
                {fieldState.error && (
                  <p className="text-red-500 font-medium  animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field, fieldState }) => (
            <Field >
              {/* <FieldLabel htmlFor="gender" className="text-sm font-medium">
                Gender
              </FieldLabel> */}
              <Select
                name="gender"
                value={field.value}
                onValueChange={field.onChange}>
                <SelectTrigger className={`w-full text-base transition-all `}
                 aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-black text-white border border-gray-700">
                    <SelectLabel>Select your gender</SelectLabel>
                    <SelectItem value="MALE" className="text-base py-3">Male</SelectItem>
                    <SelectItem value="FEMALE" className="text-base py-3">Female</SelectItem>
                    <SelectItem value="OTHER" className="text-base py-3">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div >
                {fieldState.error && (
                  <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />
      </div>
    </div>
  )
}
export default PersonalInfoForm