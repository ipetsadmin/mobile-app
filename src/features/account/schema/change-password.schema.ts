import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'validation.required'),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, 'validation.passwordTooShort'),
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordMismatch',
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
