import { AgendaItemType, type UserAgendaItem } from '@ipetsadmin/contracts';
import type { TFunction } from 'i18next';

import { formatDateTime, formatMediumDate, formatTime } from '@/utils/format-date';

type DescribeOptions = {
  timeOnly?: boolean;
};

export function describeAgendaItem(
  item: UserAgendaItem,
  t: TFunction,
  locale: string,
  { timeOnly = false }: DescribeOptions = {},
) {
  const when = timeOnly ? formatTime(item.occursAt, locale) : formatDateTime(item.occursAt, locale);

  if (item.type === AgendaItemType.APPOINTMENT) {
    return {
      title: t('agenda.appointment', { pet: item.petName }),
      detail: `${item.appointment.provider.name} · ${when}`,
    };
  }

  if (item.type === AgendaItemType.TREATMENT_DOSE) {
    return {
      title: t('agenda.dose', { medication: item.medicationName, pet: item.petName }),
      detail: when,
    };
  }

  return {
    title: t('agenda.birthday', { pet: item.petName, age: item.ageTurning }),
    detail: timeOnly ? t('agenda.allDay') : formatMediumDate(item.occursAt, locale),
  };
}
