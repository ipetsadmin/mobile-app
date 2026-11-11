import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, 'validation.passwordTooShort'),
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordMismatch',
  });

export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
