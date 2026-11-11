import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useCalendarView } from '@/hooks/use-calendar-view';
import { useTheme } from '@/hooks/use-theme';

import { CalendarDays } from './calendar-days';
import { CalendarHeader } from './calendar-header';
import { CalendarMonths } from './calendar-months';
import { CalendarYears } from './calendar-years';

type CalendarProps = {
  value?: Date;
  locale: string;
  previousLabel: string;
  nextLabel: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  onChange: (date: Date) => void;
};

export function Calendar({
  value,
  locale,
  previousLabel,
  nextLabel,
  minimumDate,
  maximumDate,
  disabled = false,
  onChange,
}: CalendarProps) {
  const theme = useTheme();
  const calendar = useCalendarView({ value, locale, minimumDate, maximumDate });
  const shared = { month: calendar.month, locale, minimumDate, maximumDate };

  return (
    <View
      pointerEvents={disabled ? 'none' : 'auto'}
      accessibilityState={{ disabled }}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
        disabled && styles.disabled,
      ]}>
      <CalendarHeader
        title={calendar.title}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        canGoPrevious={calendar.canGoPrevious}
        canGoNext={calendar.canGoNext}
        onPrevious={calendar.goPrevious}
        onNext={calendar.goNext}
        onTitlePress={calendar.zoomOut}
      />
      {calendar.view === 'days' && <CalendarDays {...shared} value={value} onSelect={onChange} />}
      {calendar.view === 'months' && (
        <CalendarMonths {...shared} onSelect={calendar.selectMonth} />
      )}
      {calendar.view === 'years' && (
        <CalendarYears {...shared} firstYear={calendar.firstYear} onSelect={calendar.selectYear} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  disabled: {
    opacity: 0.5,
  },
});
