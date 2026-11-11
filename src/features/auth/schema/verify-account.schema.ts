import { z } from 'zod';

export const CODE_LENGTH = 6;

export const verifyAccountSchema = z.object({
  code: z.string().length(CODE_LENGTH, 'validation.codeInvalid'),
});

export type VerifyAccountValues = z.infer<typeof verifyAccountSchema>;
