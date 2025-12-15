import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 1 characters long"),
  role: z.enum(["DOCTOR", "ADMIN", "PATIENT"]),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;