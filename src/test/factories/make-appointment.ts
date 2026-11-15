import { AppointmentStatus, AppointmentType, type AppointmentResponse } from '@ipetsadmin/contracts';

export function makeAppointment(overrides: Partial<AppointmentResponse> = {}): AppointmentResponse {
  return {
    id: 'appointment-1',
    petId: 'pet-1',
    ownerId: 'user-1',
    appointmentType: AppointmentType.VETERINARY,
    scheduledAt: new Date('2026-06-20T10:00:00.000Z'),
    provider: { name: 'Dr. Smith' },
    location: { locationName: 'Happy Paws', address: '1 Main St', city: 'Bogota' },
    status: AppointmentStatus.PENDING,
    createdAt: new Date('2026-06-01T10:00:00.000Z'),
    updatedAt: new Date('2026-06-01T10:00:00.000Z'),
    ...overrides,
  };
}
