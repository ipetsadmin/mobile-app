import { AgendaItemType, type UserAgendaItem } from '@ipetsadmin/contracts';

const symbols = {
  [AgendaItemType.APPOINTMENT]: { ios: 'calendar', android: 'event', web: 'event' },
  [AgendaItemType.TREATMENT_DOSE]: { ios: 'pills', android: 'medication', web: 'medication' },
  [AgendaItemType.BIRTHDAY]: { ios: 'gift', android: 'cake', web: 'cake' },
} as const;

export function getAgendaItemSymbol(item: UserAgendaItem) {
  return symbols[item.type];
}
