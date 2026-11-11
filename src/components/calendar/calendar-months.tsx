import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { getMonthLabels, isMonthWithinRange } from '@/utils/calendar';

import { CalendarOption } from './calendar-option';

type CalendarMonthsProps = {
  month: Date;
  locale: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onSelect: (month: Date) => void;
};

export function CalendarMonths({
  month,
  locale,
  minimumDate,
  maximumDate,
  onSelect,
}: CalendarMonthsProps) {
  return (
    <View style={styles.grid}>
      {getMonthLabels(locale).map((label, index) => {
        const option = new Date(month.getFullYear(), index, 1);

        return (
          <CalendarOption
            key={label}
            label={label}
            selected={index === month.getMonth()}
            disabled={!isMonthWithinRange(option, minimumDate, maximumDate)}
            onPress={() => onSelect(option)}
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
