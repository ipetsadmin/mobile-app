import { TreatmentStatus } from '@ipetsadmin/contracts';

export const treatmentStatusKeys = {
  [TreatmentStatus.WAITING_START]: 'treatment.status.waitingStart',
  [TreatmentStatus.PENDING]: 'treatment.status.pending',
  [TreatmentStatus.IN_PROGRESS]: 'treatment.status.inProgress',
  [TreatmentStatus.COMPLETED]: 'treatment.status.completed',
  [TreatmentStatus.CANCELLED]: 'treatment.status.cancelled',
} as const;

const FINISHED_STATUSES: TreatmentStatus[] = [TreatmentStatus.COMPLETED, TreatmentStatus.CANCELLED];

export function isFinishedTreatment(status: TreatmentStatus) {
  return FINISHED_STATUSES.includes(status);
}
