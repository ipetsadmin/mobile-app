import type { AppointmentResponse } from '@ipetsadmin/contracts';
import { useTranslation } from 'react-i18next';

import { RecordRow } from '@/components/record-row';
import { formatDateTime } from '@/utils/format-date';

import { appointmentStatusKeys } from '../utils/appointment-status-keys';
import { appointmentTypeKeys } from '../utils/appointment-type-keys';

type AppointmentRowProps = {
  appointment: AppointmentResponse;
  isMuted?: boolean;
};

export function AppointmentRow({ appointment, isMuted }: AppointmentRowProps) {
  const { t, i18n } = useTranslation();

  return (
    <RecordRow
      title={t(appointmentTypeKeys[appointment.appointmentType])}
      subtitle={`${appointment.provider.name} · ${formatDateTime(new Date(appointment.scheduledAt), i18n.language)}`}
      caption={t(appointmentStatusKeys[appointment.status])}
      isMuted={isMuted}
    />
  );
}
