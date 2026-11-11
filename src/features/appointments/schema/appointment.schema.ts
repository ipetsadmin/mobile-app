import { AppointmentType } from '@ipetsadmin/contracts';
import { z } from 'zod';

const requiredText = z.string({ error: 'validation.required' }).trim().min(1, 'validation.required');

export const appointmentSchema = z.object({
  appointmentType: z.enum(AppointmentType, { error: 'validation.selectOption' }),
  scheduledAt: z
    .date({ error: 'validation.required' })
    .refine((date) => date.getTime() > Date.now(), 'validation.mustBeFuture'),
  providerName: requiredText,
  locationName: requiredText,
  address: requiredText,
  city: requiredText,
  reason: z.string().trim().optional(),
});

export type AppointmentValues = z.infer<typeof appointmentSchema>;
