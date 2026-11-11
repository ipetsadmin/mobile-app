import type { TreatmentResponse } from '@ipetsadmin/contracts';
import { useTranslation } from 'react-i18next';

import { RecordRow } from '@/components/record-row';
import { formatMediumDate } from '@/utils/format-date';

import { isFinishedTreatment, treatmentStatusKeys } from '../utils/treatment-status-keys';
import { treatmentTypeKeys } from '../utils/treatment-type-keys';

type TreatmentRowProps = {
  treatment: TreatmentResponse;
};

export function TreatmentRow({ treatment }: TreatmentRowProps) {
  const { t, i18n } = useTranslation();
  const status = t(treatmentStatusKeys[treatment.status]);
  const until = treatment.endDate
    ? t('treatment.until', { date: formatMediumDate(new Date(treatment.endDate), i18n.language) })
    : undefined;

  return (
    <RecordRow
      title={treatment.medicationName}
      subtitle={`${t(treatmentTypeKeys[treatment.treatmentType])} · ${treatment.dosage}`}
      caption={until ? `${status} · ${until}` : status}
      isMuted={isFinishedTreatment(treatment.status)}
    />
  );
}
