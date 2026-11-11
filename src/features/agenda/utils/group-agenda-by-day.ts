import type { UserAgendaItem } from '@ipetsadmin/contracts';

import { isSameDay } from '@/utils/calendar';

export type AgendaDayGroup = {
  day: Date;
  items: UserAgendaItem[];
};

export function groupAgendaByDay(items: UserAgendaItem[]): AgendaDayGroup[] {
  return items.reduce<AgendaDayGroup[]>((groups, item) => {
    const lastGroup = groups.at(-1);

    if (lastGroup && isSameDay(lastGroup.day, item.occursAt)) {
      lastGroup.items.push(item);
      return groups;
    }

    return [...groups, { day: item.occursAt, items: [item] }];
  }, []);
}
