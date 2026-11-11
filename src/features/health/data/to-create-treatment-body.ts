import type { PostPetTreatmentRequestBody } from '@ipetsadmin/api-client';
import { TreatmentStatus } from '@ipetsadmin/contracts';

import type { TreatmentValues } from '../schema/treatment.schema';

const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_DAY = 86_400_000;

export function toCreateTreatmentBody(
  ownerId: string,
  values: TreatmentValues,
): PostPetTreatmentRequestBody {
  const frequencyHours = Number(values.frequencyHours);
  const durationDays = Number(values.durationDays);
  const hasStarted = values.startDate.getTime() <= Date.now();

  return {
    ownerId,
    medicationName: values.name.trim(),
    dosage: values.dosage.trim(),
    instructions: values.instructions || undefined,
    frequencyHours,
    durationDays,
    totalDoses: Math.max(1, Math.floor((durationDays * HOURS_PER_DAY) / frequencyHours)),
    status: hasStarted ? TreatmentStatus.IN_PROGRESS : TreatmentStatus.WAITING_START,
    treatmentType: values.treatmentType,
    startDate: values.startDate,
    endDate: new Date(values.startDate.getTime() + durationDays * MILLISECONDS_PER_DAY),
  };
}
