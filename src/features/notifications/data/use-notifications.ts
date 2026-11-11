import { useTranslation } from 'react-i18next';

import { describeAgendaItem, getAgendaItemKey, useAgenda } from '@/features/agenda';
import { getSignedDaysBetween } from '@/utils/calendar';
import { formatRelativeDays } from '@/utils/format-date';

const AGENDA_DAYS = 30;
const URGENT_WITHIN_DAYS = 3;

export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  isUrgent: boolean;
};

export function useNotifications() {
  const { t, i18n } = useTranslation();
  const { data: items = [], ...query } = useAgenda(AGENDA_DAYS);
  const now = new Date();

  const notifications: AppNotification[] = items.map((item) => ({
    id: getAgendaItemKey(item),
    ...describeAgendaItem(item, t, i18n.language),
    timeLabel: formatRelativeDays(item.occursAt, now, i18n.language),
    isUrgent: getSignedDaysBetween(now, item.occursAt) < URGENT_WITHIN_DAYS,
  }));

  return { notifications, ...query };
}
