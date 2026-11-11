import { TreatmentType } from '@ipetsadmin/contracts';
import { z } from 'zod';

const requiredText = z.string({ error: 'validation.required' }).trim().min(1, 'validation.required');
const positiveInteger = z
  .string({ error: 'validation.required' })
  .trim()
  .regex(/^[1-9]\d*$/, 'validation.positiveInteger');

export const treatmentSchema = z.object({
  treatmentType: z.enum(TreatmentType, { error: 'validation.selectOption' }),
  name: requiredText,
  dosage: requiredText,
  startDate: z.date({ error: 'validation.required' }),
  frequencyHours: positiveInteger,
  durationDays: positiveInteger,
  instructions: z.string().trim().optional(),
});

export type TreatmentValues = z.infer<typeof treatmentSchema>;
