import { z } from 'zod';

// Inferred DTO Types
export type RegisterDto = z.infer<typeof registerValidationSchema>;
export type LoginDto = z.infer<typeof loginValidationSchema>;

/**
 * Validates a user's full name. Allows names without a surname.
 * The regex pattern matches:
 * - One or more characters that can be letters (uppercase or lowercase) or spaces
 * - An optional second part (the surname) that starts with a space and contains one or more characters that can be letters or spaces
 */
const userFullNameRegex = /^[a-zA-Z\s]+(\s[a-zA-Z\s]+)?$/;

// Validation Schemas
export const registerValidationSchema = z.object({
  name: z.string().regex(userFullNameRegex),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, { message: 'Password must be at least 3 characters long' }),
});

export const loginValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, { message: 'Password must be at least 3 characters long' }),
});
