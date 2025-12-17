import { Control, Controller } from "react-hook-form"
import { StepFormData } from "../_schema"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Home, MapPin, Building2, Globe } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const AddressInfoForm = ({ control }: {
  control: Control<StepFormData, any, StepFormData>
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Address Information</h2>
        <p className="text-muted-foreground text-sm">Enter your complete address details</p>
      </div>

      <div >
        <Controller
          control={control}
          name="addressLine1"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="addressLine1" className="text-sm font-medium">
                Address Line 1
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder="123 Main Street"
                  aria-invalid={fieldState.invalid}
                  id="addressLine1"
                  type="text"
                  {...field}
                  className={`w-full text-base transition-all `}
                />
                <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                  <Home className="h-5 w-5" />
                </InputGroupAddon>
              </InputGroup>
              <div className="h-5 mt-1">
                {fieldState.error && (
                  <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="addressLine2"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="addressLine2" className="text-sm font-medium">
                Address Line 2
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  aria-invalid={fieldState.invalid}
                  id="addressLine2"
                  type="text"
                  {...field}
                  className={`w-full text-base transition-all `}
                />
                <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                  <Building2 className="h-5 w-5" />
                </InputGroupAddon>
              </InputGroup>
              <div className="h-5 mt-1">
                {fieldState.error && (
                  <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="addressLine3"
          render={({ field, fieldState }) => (
            <Field >
              <FieldLabel htmlFor="addressLine3" className="text-sm font-medium">
                Address Line 3 <span className="text-muted-foreground">(Optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder="Near landmark or additional details"
                  aria-invalid={fieldState.invalid}
                  id="addressLine3"
                  type="text"
                  {...field}
                  className={`w-full text-base transition-all `}
                />
                <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                  <MapPin className="h-5 w-5" />
                </InputGroupAddon>
              </InputGroup>
              <div className="h-5 mt-1">
                {fieldState.error && (
                  <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                    <span>{fieldState.error.message}</span>
                  </p>
                )}
              </div>
            </Field>
          )}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="city"
            render={({ field, fieldState }) => (
              <Field >
                <FieldLabel htmlFor="city" className="text-sm font-medium">
                  City
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Enter city name"
                    aria-invalid={fieldState.invalid}
                    id="city"
                    type="text"
                    {...field}
                    className={`w-full text-base transition-all `}
                  />
                  <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                    <Building2 className="h-5 w-5" />
                  </InputGroupAddon>
                </InputGroup>
                <div className="h-5 mt-1">
                  {fieldState.error && (
                    <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                      <span>{fieldState.error.message}</span>
                    </p>
                  )}
                </div>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="pinCode"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="pinCode" className="text-sm font-medium">
                  PIN Code
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Enter postal code"
                    aria-invalid={fieldState.invalid}
                    id="pinCode"
                    type="text"
                    {...field}
                    className={`w-full text-base transition-all `}
                  />
                  <InputGroupAddon className={fieldState.error ? 'text-red-500' : ''}>
                    <MapPin className="h-5 w-5" />
                  </InputGroupAddon>
                </InputGroup>
                <div className="h-5 mt-1">
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
        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="state"
            render={({ field, fieldState }) => (
              <Field >
                <FieldLabel htmlFor="state" className="text-sm font-medium">
                  State / Province
                </FieldLabel>
                <Select
                  name="state"
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger className={`w-full text-base transition-all `} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="bg-black text-white border border-gray-700">
                      <SelectLabel>Select your state</SelectLabel>
                      <SelectItem value="ASSAM" className="text-base py-3">Assam</SelectItem>
                      <SelectItem value="BIHAR" className="text-base py-3">Bihar</SelectItem>
                      <SelectItem value="GOA" className="text-base py-3">Goa</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="h-5 mt-1">
                  {fieldState.error && (
                    <p className="text-red-500 leading-5 font-medium  animate-in fade-in duration-150">
                      <span>{fieldState.error.message}</span>
                    </p>
                  )}
                </div>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field, fieldState }) => (
              <Field >
                <FieldLabel htmlFor="country" className="text-sm font-medium">
                  Country
                </FieldLabel>
                <Select
                  name="country"
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger className={`w-full  text-base transition-all`} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="bg-black text-white border border-gray-700">
                      <SelectLabel>Select your country</SelectLabel>
                      <SelectItem value="INDIA" className="text-base py-3">India</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="h-5 mt-1">
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
    </div>
  )
}
export default AddressInfoForm