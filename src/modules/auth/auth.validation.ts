import { z } from "zod";

// Inferred DTO Types
export type RegisterDto = z.infer<typeof registerValidationSchema>;
export type LoginDto = z.infer<typeof loginValidationSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordValidationSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordValidationSchema>;

// Validation Schemas
export const registerValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" }),
  companyName: z.string({ required_error: "Company name is required" }),
});

export const loginValidationSchema = z.object({
  emailOrUsername: z.string(),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" }),
});

export const forgotPasswordValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const changePasswordValidationSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" }),
  token: z.string({ required_error: "Token is required" }),
});
