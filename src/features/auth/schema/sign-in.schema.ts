import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(1, 'validation.required'),
});

export type SignInValues = z.infer<typeof signInSchema>;
