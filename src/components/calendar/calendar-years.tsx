import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { YEARS_PER_PAGE } from '@/utils/calendar';

import { CalendarOption } from './calendar-option';

type CalendarYearsProps = {
  month: Date;
  firstYear: number;
  minimumDate?: Date;
  maximumDate?: Date;
  onSelect: (month: Date) => void;
};

export function CalendarYears({
  month,
  firstYear,
  minimumDate,
  maximumDate,
  onSelect,
}: CalendarYearsProps) {
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, index) => firstYear + index);

  return (
    <View style={styles.grid}>
      {years.map((year) => {
        const isAfterMinimum = !minimumDate || year >= minimumDate.getFullYear();
        const isBeforeMaximum = !maximumDate || year <= maximumDate.getFullYear();

        return (
          <CalendarOption
            key={year}
            label={String(year)}
            selected={year === month.getFullYear()}
            disabled={!isAfterMinimum || !isBeforeMaximum}
            onPress={() => onSelect(new Date(year, month.getMonth(), 1))}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
});
