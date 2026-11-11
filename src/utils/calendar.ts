const DAYS_IN_WEEK = 7;
const REFERENCE_SUNDAY = new Date(2023, 0, 1);
const MONTHS_IN_YEAR = 12;
const DAY_IN_MS = 86_400_000;

export const YEARS_PER_PAGE = 12;

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function subtractYears(date: Date, years: number) {
  return new Date(date.getFullYear() - years, date.getMonth(), date.getDate());
}

export function getDaysBetween(start: Date, end: Date) {
  return Math.max(Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_IN_MS), 0);
}

export function getSignedDaysBetween(start: Date, end: Date) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_IN_MS);
}

export function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function getFirstWeekday(locale: string) {
  return locale.startsWith('en') ? 0 : 1;
}

export function toNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getMonthCells(month: Date, firstWeekday = 0): (Date | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingBlanks = (new Date(year, monthIndex, 1).getDay() - firstWeekday + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const blanks = Array.from({ length: leadingBlanks }, () => null);
  const days = Array.from({ length: dayCount }, (_, index) => new Date(year, monthIndex, index + 1));

  return [...blanks, ...days];
}

export function getWeekdayLabels(locale: string, firstWeekday = 0) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
    formatter.format(new Date(2023, 0, REFERENCE_SUNDAY.getDate() + firstWeekday + index)),
  );
}

export function isDayWithinRange(day: Date, minimumDate?: Date, maximumDate?: Date) {
  const time = day.getTime();
  const isAfterMinimum = !minimumDate || time >= startOfDay(minimumDate).getTime();
  const isBeforeMaximum = !maximumDate || time <= startOfDay(maximumDate).getTime();

  return isAfterMinimum && isBeforeMaximum;
}

export function getMonthLabels(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });

  return Array.from({ length: MONTHS_IN_YEAR }, (_, index) =>
    formatter.format(new Date(REFERENCE_SUNDAY.getFullYear(), index, 1)),
  );
}

export function getYearPageStart(year: number, lastSelectableYear?: number) {
  if (lastSelectableYear === undefined) {
    return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  }

  const pagesBack = Math.floor((lastSelectableYear - year) / YEARS_PER_PAGE);

  return lastSelectableYear - YEARS_PER_PAGE * (pagesBack + 1) + 1;
}

export function isMonthWithinRange(month: Date, minimumDate?: Date, maximumDate?: Date) {
  const isAfterMinimum = !minimumDate || month >= startOfMonth(minimumDate);
  const isBeforeMaximum = !maximumDate || month <= startOfMonth(maximumDate);

  return isAfterMinimum && isBeforeMaximum;
}

export function clampMonth(month: Date, minimumDate?: Date, maximumDate?: Date) {
  if (minimumDate && month < startOfMonth(minimumDate)) {
    return startOfMonth(minimumDate);
  }

  if (maximumDate && month > startOfMonth(maximumDate)) {
    return startOfMonth(maximumDate);
  }

  return month;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
