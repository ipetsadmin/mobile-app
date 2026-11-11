import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { CalendarArrow } from './calendar-arrow';

type CalendarHeaderProps = {
  title: string;
  previousLabel: string;
  nextLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTitlePress?: () => void;
};

export function CalendarHeader({
  title,
  previousLabel,
  nextLabel,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onTitlePress,
}: CalendarHeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        disabled={!onTitlePress}
        hitSlop={Spacing.xs}
        onPress={onTitlePress}
        style={({ pressed }) => [styles.titleButton, pressed && styles.dimmed]}>
        <ThemedText type="bodyStrong" style={styles.title}>
          {title}
        </ThemedText>
        {onTitlePress && (
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={12}
            weight="semibold"
            tintColor={theme.text}
          />
        )}
      </Pressable>
      <CalendarArrow
        direction="previous"
        label={previousLabel}
        disabled={!canGoPrevious}
        onPress={onPrevious}
      />
      <CalendarArrow direction="next" label={nextLabel} disabled={!canGoNext} onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: 36,
    marginRight: 'auto',
  },
  title: {
    textTransform: 'capitalize',
  },
  dimmed: {
    opacity: 0.3,
  },
});
