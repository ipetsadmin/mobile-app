import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'validation.required'),
  lastName: z.string().trim().min(1, 'validation.required'),
  photoUri: z.string().optional(),
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;
