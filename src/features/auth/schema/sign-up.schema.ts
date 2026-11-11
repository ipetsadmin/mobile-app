import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, 'validation.required'),
  lastName: z.string().trim().min(1, 'validation.required'),
  email: z.email('validation.emailInvalid'),
  password: z.string().min(MIN_PASSWORD_LENGTH, 'validation.passwordTooShort'),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
