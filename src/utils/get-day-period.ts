const NOON_HOUR = 12;
const EVENING_HOUR = 18;

export type DayPeriod = 'morning' | 'afternoon' | 'evening';

export function getDayPeriod(date: Date): DayPeriod {
  const hour = date.getHours();

  if (hour < NOON_HOUR) {
    return 'morning';
  }

  return hour < EVENING_HOUR ? 'afternoon' : 'evening';
}
