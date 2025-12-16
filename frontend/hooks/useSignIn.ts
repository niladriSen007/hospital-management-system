"use client"

import { signInUser } from "@/client/path";
import { useUserStore } from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignIn = (): {
  isSignInPending: boolean;
  signInUserMutation: (data: { email: string; password: string; }) => void;
} => {
  const router = useRouter();
  const { updateUser } = useUserStore();
  const { mutate: signInUserMutation, isPending: isSignInPending } = useMutation({
    mutationKey: ["sign-in-user"],
    mutationFn: async (data: { email: string; password: string; }) => {
      console.log("Inside hook")
      return await signInUser(data);
    },
    onSuccess: ({ data }) => {
      toast.success("Logged in successfully.");
      updateUser({
        id: data?.userId,
        name: data?.name,
        email: data?.email
      });
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