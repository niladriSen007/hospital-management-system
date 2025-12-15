"use client"

import { signInUser } from "@/client/path";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignIn = (): {
  isSignInPending: boolean;
  signInUserMutation: (data: { email: string; password: string; }) => void;
} => {
  const router = useRouter();
  const { mutate: signInUserMutation, isPending: isSignInPending } = useMutation({
    mutationKey: ["sign-in-user"],
    mutationFn: async (data: { email: string; password: string; }) => {
      console.log("Inside hook")
      await signInUser(data);
    },
    onSuccess: () => {
      toast.success("Logged in successfully.");
      console.log("User logged in successfully");
      router.push("/")
    },
    onError: (error: {
      message?: string;
    }) => {
      toast.error(`Sign in failed: ${error.message || "Unknown error"}`);
    }
  })

  return { isSignInPending, signInUserMutation };

}