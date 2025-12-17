import { ComponentType } from "react";
import { z } from "zod";

export const personalInfoSchema = z.object({
  phone: z.string("Phone number is required").min(8, "Phone number is too short"),
  age: z.string("Age is required").min(1, "Age is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], "Select a gender"),
});

export type PersonalInfoSchema = z.infer<typeof personalInfoSchema>;

export const addressInfoSchema = z.object({
  addressLine1: z.string("Address Line 1 is required").min(5, "Address Line 1 is too short"),
  addressLine2: z.string("Address Line 2 is required").min(5, "Address Line 2 is too short"),
  addressLine3: z.string().optional(),
  city: z.string("City is required").min(2, "City is too short"),
  state: z.enum([
    "ANDHRA_PRADESH",
    "ARUNACHAL_PRADESH",
    "ASSAM",
    "BIHAR",
    "CHHATTISGARH",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL_PRADESH",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "MADHYA_PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL_NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR_PRADESH",
    "UTTARAKHAND",
    "WEST_BENGAL"
  ], "Select a state"),
  pinCode: z.string("Pin Code is required").min(4, "Pin Code is too short"),
  country: z.enum(["INDIA"], "Select a country"),
});

export type AddressInfoSchema = z.infer<typeof addressInfoSchema>;

export type StepFormData = PersonalInfoSchema | AddressInfoSchema;
export type AllFormFields = PersonalInfoSchema & AddressInfoSchema;
export interface Step {
  id: string;
  name: string;
  icon: ComponentType<{
    className?: string;
  }>;
}