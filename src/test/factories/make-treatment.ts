import {
  type TreatmentResponse,
  TreatmentStatus,
  TreatmentType,
} from "@ipetsadmin/contracts"

export function makeTreatment(
  overrides: Partial<TreatmentResponse> = {},
): TreatmentResponse {
  return {
    id: "treatment-1",
    petId: "pet-1",
    ownerId: "user-1",
    medicationName: "Amoxicillin",
    dosage: "1 tablet",
    frequencyHours: 8,
    durationDays: 5,
    totalDoses: 15,
    status: TreatmentStatus.IN_PROGRESS,
    treatmentType: TreatmentType.MEDICATION,
    startDate: new Date("2026-06-10T08:00:00.000Z"),
    endDate: new Date("2026-06-15T08:00:00.000Z"),
    createdAt: new Date("2026-06-10T08:00:00.000Z"),
    updatedAt: new Date("2026-06-10T08:00:00.000Z"),
    ...overrides,
  }
}
