import { getSignedDaysBetween } from './calendar';

export function formatLongDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}

export function formatMonthYear(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

export function formatMediumDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export function formatDayLabel(date: Date, locale: string) {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);

  return `${weekday} · ${day}`;
}

export function formatTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(date);
}

export function formatDayHeading(date: Date, today: Date, locale: string) {
  const days = getSignedDaysBetween(today, date);

  if (days === 0 || days === 1) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day');
  }

  return formatDayLabel(date, locale);
}

export function formatDateTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatRelativeDays(date: Date, today: Date, locale: string) {
  const days = getSignedDaysBetween(today, date);

  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day');
}
