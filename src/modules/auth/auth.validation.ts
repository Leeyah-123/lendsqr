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

/**
 * Validates a user's password. The regex pattern matches:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation Schemas
export const registerValidationSchema = z.object({
  name: z.string().regex(userFullNameRegex, 'Invalid name'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .regex(
      passwordRegex,
      'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const loginValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .regex(
      passwordRegex,
      'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});
