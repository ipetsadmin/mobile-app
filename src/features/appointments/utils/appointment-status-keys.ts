import { AppointmentStatus } from '@ipetsadmin/contracts';

export const appointmentStatusKeys = {
  [AppointmentStatus.PENDING]: 'appointment.status.pending',
  [AppointmentStatus.CONFIRMED]: 'appointment.status.confirmed',
  [AppointmentStatus.CANCELLED]: 'appointment.status.cancelled',
  [AppointmentStatus.COMPLETED]: 'appointment.status.completed',
} as const;
