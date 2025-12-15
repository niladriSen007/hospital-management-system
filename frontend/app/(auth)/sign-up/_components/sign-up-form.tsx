"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSignUp } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSignIcon, CircleUserRound, KeyRound, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SignUpSchema, signUpSchema } from "../_schema";

const SignUpForm = () => {

  const [_, startSignUpTransition] = useTransition();
  const { isSignUpPending, registerUserMutation } = useSignUp();

  const form = useForm({
    resolver: zodResolver(signUpSchema), defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit: SubmitHandler<SignUpSchema> = (data: SignUpSchema) => {
    console.log(data)
    startSignUpTransition(() => {
      registerUserMutation(data)
    })
  }


  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/*  <p className="text-start text-muted-foreground text-sm">
                  Enter your email address
                </p> */}





      <Controller
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <Field>
            <Select
              name="role"
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-black text-white border border-gray-700">
                  <SelectLabel>Select your role</SelectLabel>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PATIENT">Patient</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {
              fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            }
          </Field>
        )}
      />


      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            {/*  <FieldLabel htmlFor="name">Name</FieldLabel> */}
            <InputGroup>
              <InputGroupInput placeholder="Your full name" aria-invalid={fieldState.invalid} id="name" type="text" {...field} className="w-full" />
              <InputGroupAddon>
                <CircleUserRound />
              </InputGroupAddon>
            </InputGroup>
            {
              fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            }
          </Field>
        )}
      />


      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field>
            {/* <FieldLabel htmlFor="email">Email</FieldLabel> */}
            <InputGroup>
              <InputGroupInput placeholder="example@example.com" aria-invalid={fieldState.invalid} id="email" type="email" {...field} className="w-full" />
              <InputGroupAddon>
                <AtSignIcon />
              </InputGroupAddon>
            </InputGroup>
            {
              fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            }
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field>
            {/*       <FieldLabel htmlFor="password">Password</FieldLabel> */}
            <InputGroup>
              <InputGroupInput placeholder="********" aria-invalid={fieldState.invalid} id="password" type="password" {...field} className="w-full" />
              <InputGroupAddon>
                <KeyRound />
              </InputGroupAddon>
            </InputGroup>
            {
              fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            }
          </Field>
        )}
      />
      <Button disabled={isSignUpPending} className="w-full" type="submit">
        {
          isSignUpPending ? <>
            <Loader2 /> Creating account...
          </> : "Create Account"
        }
      </Button>
    </form>
  )
}

export default SignUpForm