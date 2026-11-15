import {
  AgendaItemType,
  DoseStatus,
  type UserAgendaAppointmentItem,
  type UserAgendaBirthdayItem,
  type UserAgendaTreatmentDoseItem,
} from '@ipetsadmin/contracts';

import { makeAppointment } from './make-appointment';

export function makeAppointmentItem(
  overrides: Partial<UserAgendaAppointmentItem> = {},
): UserAgendaAppointmentItem {
  const appointment = overrides.appointment ?? makeAppointment();

  return {
    type: AgendaItemType.APPOINTMENT,
    occursAt: appointment.scheduledAt,
    petId: appointment.petId,
    petName: 'Luna',
    appointment,
    ...overrides,
  };
}

export function makeDoseItem(
  overrides: Partial<UserAgendaTreatmentDoseItem> = {},
): UserAgendaTreatmentDoseItem {
  const occursAt = overrides.occursAt ?? new Date('2026-06-20T08:00:00.000Z');

  return {
    type: AgendaItemType.TREATMENT_DOSE,
    occursAt,
    petId: 'pet-1',
    petName: 'Luna',
    medicationName: 'Amoxicillin',
    dose: {
      id: 'dose-1',
      treatmentId: 'treatment-1',
      petId: 'pet-1',
      ownerId: 'user-1',
      doseNumber: 1,
      scheduledDate: occursAt,
      status: DoseStatus.PENDING,
      createdAt: occursAt,
      updatedAt: occursAt,
    },
    ...overrides,
  };
}

export function makeBirthdayItem(
  overrides: Partial<UserAgendaBirthdayItem> = {},
): UserAgendaBirthdayItem {
  const occursAt = overrides.occursAt ?? new Date('2026-06-20T00:00:00.000Z');

  return {
    type: AgendaItemType.BIRTHDAY,
    occursAt,
    petId: 'pet-1',
    petName: 'Luna',
    birthDate: new Date('2023-06-20T00:00:00.000Z'),
    ageTurning: 3,
    ...overrides,
  };
}
