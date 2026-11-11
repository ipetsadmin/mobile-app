const SLOT_MINUTES = 30;
const MINUTES_IN_HOUR = 60;
const SLOTS_PER_DAY = (24 * MINUTES_IN_HOUR) / SLOT_MINUTES;

const pad = (value: number) => String(value).padStart(2, '0');

export function toTimeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function withTime(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

export function roundToSlot(date: Date, direction: 'floor' | 'ceil') {
  const slotMs = SLOT_MINUTES * MINUTES_IN_HOUR * 1000;
  const round = direction === 'floor' ? Math.floor : Math.ceil;

  return new Date(round(date.getTime() / slotMs) * slotMs);
}

export function getTimeSlots(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' });
  const base = new Date(2023, 0, 1);

  return Array.from({ length: SLOTS_PER_DAY }, (_, index) => {
    const minutes = index * SLOT_MINUTES;
    const slot = new Date(2023, 0, 1, 0, minutes);
    const value = toTimeValue(slot);

    return { value, label: formatter.format(withTime(base, value)) };
  });
}
