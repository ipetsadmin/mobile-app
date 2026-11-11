import { AppointmentStatus, type AppointmentResponse } from '@ipetsadmin/contracts';

const CLOSED_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
];

function getTime(appointment: AppointmentResponse) {
  return new Date(appointment.scheduledAt).getTime();
}

export function splitAppointments(appointments: AppointmentResponse[], now: Date) {
  const isUpcoming = (appointment: AppointmentResponse) =>
    getTime(appointment) >= now.getTime() && !CLOSED_STATUSES.includes(appointment.status);

  return {
    upcoming: appointments.filter(isUpcoming).sort((a, b) => getTime(a) - getTime(b)),
    past: appointments.filter((item) => !isUpcoming(item)).sort((a, b) => getTime(b) - getTime(a)),
  };
}
