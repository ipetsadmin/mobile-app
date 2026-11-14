import { AppointmentStatus, type AppointmentResponse } from '@ipetsadmin/contracts';

import { splitAppointments } from './split-appointments';

const now = new Date('2026-06-15T12:00:00.000Z');

function makeAppointment(
  id: string,
  scheduledAt: string,
  status: AppointmentStatus,
): AppointmentResponse {
  const partial: Partial<AppointmentResponse> = {
    id,
    scheduledAt: new Date(scheduledAt),
    status,
  };

  return partial as AppointmentResponse;
}

describe('splitAppointments', () => {
  it('puts future open appointments in upcoming, ordered by date', () => {
    const later = makeAppointment('later', '2026-06-20T10:00:00.000Z', AppointmentStatus.PENDING);
    const sooner = makeAppointment('sooner', '2026-06-16T10:00:00.000Z', AppointmentStatus.PENDING);

    const { upcoming, past } = splitAppointments([later, sooner], now);

    expect(upcoming.map((item) => item.id)).toEqual(['sooner', 'later']);
    expect(past).toEqual([]);
  });

  it('puts past and closed appointments in past, most recent first', () => {
    const old = makeAppointment('old', '2026-06-01T10:00:00.000Z', AppointmentStatus.PENDING);
    const cancelled = makeAppointment('cancelled', '2026-06-20T10:00:00.000Z', AppointmentStatus.CANCELLED);
    const recent = makeAppointment('recent', '2026-06-10T10:00:00.000Z', AppointmentStatus.PENDING);

    const { upcoming, past } = splitAppointments([old, cancelled, recent], now);

    expect(upcoming).toEqual([]);
    expect(past.map((item) => item.id)).toEqual(['cancelled', 'recent', 'old']);
  });
});
