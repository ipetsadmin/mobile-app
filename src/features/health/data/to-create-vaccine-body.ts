import type { PostPetTreatmentRequestBody } from '@ipetsadmin/api-client';
import { TreatmentStatus, TreatmentType } from '@ipetsadmin/contracts';

import type { VaccineValues } from '../schema/vaccine.schema';

export function toCreateVaccineBody(ownerId: string, values: VaccineValues): PostPetTreatmentRequestBody {
  const hasDetails = Boolean(values.laboratory && values.lotNumber);

  return {
    ownerId,
    medicationName: values.name.trim(),
    dosage: '1',
    frequencyHours: 0,
    durationDays: 1,
    totalDoses: 1,
    status: TreatmentStatus.COMPLETED,
    treatmentType: TreatmentType.VACCINATION,
    startDate: values.administeredAt,
    instructions: values.notes || undefined,
    vaccinationDetails: hasDetails
      ? {
          laboratory: values.laboratory as string,
          lotNumber: values.lotNumber as string,
          administeredAt: values.administeredAt,
        }
      : undefined,
  };
}
