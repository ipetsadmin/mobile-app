import { AppointmentType } from '@ipetsadmin/contracts';

export const appointmentTypeKeys = {
  [AppointmentType.VETERINARY]: 'appointment.types.veterinary',
  [AppointmentType.DENTAL]: 'appointment.types.dental',
  [AppointmentType.GROOMING]: 'appointment.types.grooming',
  [AppointmentType.TRAINING]: 'appointment.types.training',
  [AppointmentType.OTHER]: 'appointment.types.other',
} as const;
