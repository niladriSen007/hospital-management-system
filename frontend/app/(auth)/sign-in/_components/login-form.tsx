

"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSignIn, useSignUp } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSignIcon, CircleUserRound, KeyRound, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SignInSchema, signInSchema } from "../_schema";

const LoginForm = () => {


  const [_, startSignInTransition] = useTransition();
  const { isSignInPending, signInUserMutation } = useSignIn();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit: SubmitHandler<SignInSchema> = (data: SignInSchema) => {
    console.log(data)
    startSignInTransition(() => {
      signInUserMutation(data)
    })
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/*  <p className="text-start text-muted-foreground text-sm">
                  Enter your email address
                </p> */}


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
        <Button disabled={isSignInPending} className="w-full" type="submit">
          {
            isSignInPending ? <>
              <Loader2 /> Signing in...
            </> : "Sign In"
          }
        </Button>
      </form>
    </div>
  )
}

export default LoginForm