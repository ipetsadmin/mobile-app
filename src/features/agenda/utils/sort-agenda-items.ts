import { AgendaItemType, type UserAgendaItem } from '@ipetsadmin/contracts';

export function sortAgendaItems(items: UserAgendaItem[]): UserAgendaItem[] {
  return items
    .map((item) => ({ ...item, occursAt: new Date(item.occursAt) }))
    .sort((a, b) => a.occursAt.getTime() - b.occursAt.getTime());
}

export function getAgendaItemKey(item: UserAgendaItem): string {
  if (item.type === AgendaItemType.APPOINTMENT) return `appointment-${item.appointment.id}`;
  if (item.type === AgendaItemType.TREATMENT_DOSE) return `dose-${item.dose.id}`;

  return `birthday-${item.petId}-${item.occursAt.toISOString()}`;
}
