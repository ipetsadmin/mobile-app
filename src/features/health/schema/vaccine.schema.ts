import { z } from 'zod';

import { endOfDay } from '@/utils/calendar';

export const vaccineSchema = z
  .object({
    name: z.string({ error: 'validation.required' }).trim().min(1, 'validation.required'),
    administeredAt: z
      .date({ error: 'validation.required' })
      .refine((date) => date.getTime() <= endOfDay(new Date()).getTime(), 'validation.notFuture'),
    laboratory: z.string().trim().optional(),
    lotNumber: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    if (!values.laboratory === !values.lotNumber) return;

    context.addIssue({
      code: 'custom',
      path: [values.laboratory ? 'lotNumber' : 'laboratory'],
      message: 'validation.required',
    });
  });

export type VaccineValues = z.infer<typeof vaccineSchema>;
