"use client"

import { registerUser } from "@/client/path";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignUp = (): {
  isSignUpPending: boolean;
  registerUserMutation: (data: { email: string; password: string; name: string, role: "DOCTOR" | "ADMIN" | "PATIENT" }) => void;
} => {
  const router = useRouter();
  /*   const queryClient = useQueryClient(); */
  const { mutate: registerUserMutation, isPending: isSignUpPending } = useMutation({
    mutationKey: ["sign-up-user"],
    mutationFn: async (data: { email: string; password: string; name: string, role: "DOCTOR" | "ADMIN" | "PATIENT" }) => {
      console.log("Inside hook")
      await registerUser(data);
    },
    onSuccess: () => {
      toast.success("Account created successfully. Please log in.");
      console.log("User registered successfully");
      router.push("/sign-in")
      /* queryClient.invalidateQueries({ queryKey: ["sign-up-user"] }); */
    },
    onError: (error: {
      message?: string;
    }) => {
      toast.error(`Sign up failed: ${error.message || "Unknown error"}`);
    }
  })

  return { isSignUpPending, registerUserMutation };

}