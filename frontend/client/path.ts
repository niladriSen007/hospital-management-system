import { client } from "./axios";

export const AUTH_SERVICE = 'auth/core';

export const registerUser = (userData: { email: string; password: string; name: string }) => {
  console.log("Inside axios path")
  return client.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${AUTH_SERVICE}/register`, {
    ...userData,
    roles: ["PATIENT"]
  });
}

export const signInUser = (userData: { email: string; password: string }) => {
  console.log("Inside axios path")
  return client.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${AUTH_SERVICE}/login`, {
    ...userData
  });
}