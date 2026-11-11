import { useState } from 'react';

import {
  addMonths,
  clampMonth,
  getYearPageStart,
  startOfMonth,
  YEARS_PER_PAGE,
} from '@/utils/calendar';
import { formatMonthYear } from '@/utils/format-date';

type CalendarView = 'days' | 'months' | 'years';

type UseCalendarViewArgs = {
  value?: Date;
  locale: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

const monthsPerStep = {
  days: 1,
  months: 12,
  years: 12 * YEARS_PER_PAGE,
} as const;

const parentView = {
  days: 'months',
  months: 'years',
  years: undefined,
} as const;

export function useCalendarView({ value, locale, minimumDate, maximumDate }: UseCalendarViewArgs) {
  const [view, setView] = useState<CalendarView>('days');
  const [month, setMonth] = useState(() => startOfMonth(value ?? maximumDate ?? new Date()));
  const year = month.getFullYear();
  const firstYear = getYearPageStart(year, maximumDate?.getFullYear());
  const titles = {
    days: formatMonthYear(month, locale),
    months: String(year),
    years: `${firstYear} – ${firstYear + YEARS_PER_PAGE - 1}`,
  };
  const periodStart = { days: month, months: new Date(year, 0, 1), years: new Date(firstYear, 0, 1) };
  const nextPeriodStart = addMonths(periodStart[view], monthsPerStep[view]);
  const showMonth = (target: Date) => setMonth(clampMonth(target, minimumDate, maximumDate));
  const zoomOutTarget = parentView[view];

  return {
    view,
    month,
    firstYear,
    title: titles[view],
    canGoPrevious: !minimumDate || periodStart[view] > startOfMonth(minimumDate),
    canGoNext: !maximumDate || nextPeriodStart <= startOfMonth(maximumDate),
    goPrevious: () => showMonth(addMonths(month, -monthsPerStep[view])),
    goNext: () => showMonth(addMonths(month, monthsPerStep[view])),
    zoomOut: zoomOutTarget && (() => setView(zoomOutTarget)),
    selectMonth: (target: Date) => {
      showMonth(target);
      setView('days');
    },
    selectYear: (target: Date) => {
      showMonth(target);
      setView('months');
    },
  };
}
