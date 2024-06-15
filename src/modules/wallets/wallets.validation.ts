import { z } from 'zod';

// Inferred DTO Types
export type FundUserWalletDto = z.infer<typeof fundUserWalletValidationSchema>;
export type TransferFundsDto = z.infer<typeof transferFundsValidationSchema>;
export type WithdrawFundsDto = z.infer<typeof withdrawFundsValidationSchema>;

// Validation Schemas
export const fundUserWalletValidationSchema = z.object({
  userId: z.string().uuid(),
  transactionId: z
    .string({
      required_error: 'Please provide a transaction ID',
      invalid_type_error: 'Invalid transaction ID',
    })
    .min(2, { message: 'Invalid transaction ID' }),
  amount: z
    .number({
      required_error: 'Please provide an amount',
      invalid_type_error: 'Invalid amount',
    })
    .min(0, { message: 'Amount must be greater than 0' }),
});
export const transferFundsValidationSchema = z.object({
  userId: z.string().uuid(),
  amount: z
    .number({
      required_error: 'Please provide an amount',
      invalid_type_error: 'Invalid amount',
    })
    .min(0, { message: 'Amount must be greater than 0' }),
  acctNumber: z
    .number({
      required_error: 'Please provide receiving account number',
      invalid_type_error: 'Invalid account number',
    })
    .min(11, { message: 'Invalid account number' }),
});
export const withdrawFundsValidationSchema = z.object({
  userId: z.string().uuid(),
  amount: z
    .number({
      required_error: 'Please provide an amount',
      invalid_type_error: 'Invalid amount',
    })
    .min(0, { message: 'Amount must be greater than 0' }),
});
