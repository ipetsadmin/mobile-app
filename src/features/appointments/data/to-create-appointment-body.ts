import type { PostPetAppointmentRequestBody } from '@ipetsadmin/api-client';
import { AppointmentStatus } from '@ipetsadmin/contracts';

import type { AppointmentValues } from '../schema/appointment.schema';

export function toCreateAppointmentBody(
  ownerId: string,
  values: AppointmentValues,
): PostPetAppointmentRequestBody {
  return {
    ownerId,
    status: AppointmentStatus.PENDING,
    appointmentType: values.appointmentType,
    scheduledAt: values.scheduledAt,
    provider: { name: values.providerName.trim() },
    location: {
      locationName: values.locationName.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
    },
    reason: values.reason || undefined,
  };
}
