import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatDayLabel } from '@/utils/format-date';
import { getDayPeriod } from '@/utils/get-day-period';

const greetingKeys = {
  morning: 'home.greeting.morning',
  afternoon: 'home.greeting.afternoon',
  evening: 'home.greeting.evening',
} as const;

type GreetingProps = {
  name: string;
  companionCount: number;
};

export function Greeting({ name, companionCount }: GreetingProps) {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const firstName = name.trim().split(' ')[0];

  return (
    <View style={styles.greeting}>
      <ThemedText type="label">{formatDayLabel(now, i18n.language)}</ThemedText>
      <ThemedText type="display" accessibilityRole="header">
        {t(greetingKeys[getDayPeriod(now)], { name: firstName })}
      </ThemedText>
      <ThemedText type="body">
        {companionCount > 0
          ? t('home.companions', { count: companionCount })
          : t('home.noCompanions')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: Spacing.xs,
  },
});
