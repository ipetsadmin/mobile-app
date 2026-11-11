import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  getFirstWeekday,
  getMonthCells,
  getWeekdayLabels,
  isDayWithinRange,
  isSameDay,
} from '@/utils/calendar';
import { formatLongDate } from '@/utils/format-date';

import { CalendarDay } from './calendar-day';

type CalendarDaysProps = {
  month: Date;
  value?: Date;
  locale: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onSelect: (day: Date) => void;
};

export function CalendarDays({
  month,
  value,
  locale,
  minimumDate,
  maximumDate,
  onSelect,
}: CalendarDaysProps) {
  const firstWeekday = getFirstWeekday(locale);

  return (
    <View style={styles.grid}>
      {getWeekdayLabels(locale, firstWeekday).map((weekday) => (
        <ThemedText key={weekday} type="label" themeColor="textSecondary" style={styles.weekday}>
          {weekday}
        </ThemedText>
      ))}
      {getMonthCells(month, firstWeekday).map((day, index) =>
        day ? (
          <CalendarDay
            key={day.getTime()}
            day={day.getDate()}
            accessibilityLabel={formatLongDate(day, locale)}
            selected={!!value && isSameDay(day, value)}
            disabled={!isDayWithinRange(day, minimumDate, maximumDate)}
            onPress={() => onSelect(day)}
          />
        ) : (
          <View key={`blank-${index}`} style={styles.blank} />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekday: {
    width: `${100 / 7}%`,
    paddingVertical: Spacing.xs,
    textAlign: 'center',
  },
  blank: {
    width: `${100 / 7}%`,
  },
});
