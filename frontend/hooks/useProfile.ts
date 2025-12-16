"use client"

import { getUserProfile } from "@/client/path";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useProfile = () => {
  const { updateUser } = useUserStore();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await getUserProfile();
      return response.data;
    },
  });

  // Update store whenever data changes
  useEffect(() => {
    if (data) {
      updateUser(data);
    }
  }, [data, updateUser]);

  return {
    user: data,
    isLoading: isPending,
    error,
    refetch,
  };
}