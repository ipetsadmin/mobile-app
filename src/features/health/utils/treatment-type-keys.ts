import { TreatmentType } from '@ipetsadmin/contracts';

export const treatmentTypeKeys = {
  [TreatmentType.MEDICATION]: 'treatment.types.medication',
  [TreatmentType.DESPARASITIZATION]: 'treatment.types.desparasitization',
  [TreatmentType.SURGERY]: 'treatment.types.surgery',
  [TreatmentType.DIAGNOSIS]: 'treatment.types.diagnosis',
  [TreatmentType.EXAM]: 'treatment.types.exam',
  [TreatmentType.DENTAL]: 'treatment.types.dental',
  [TreatmentType.OTHER]: 'treatment.types.other',
  [TreatmentType.VACCINATION]: 'vaccine.title',
} as const;

export const selectableTreatmentTypes = Object.values(TreatmentType).filter(
  (type) => type !== TreatmentType.VACCINATION,
);
