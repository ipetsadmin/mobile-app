import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ICON_BADGE_SIZE = 36;

type AgendaRowProps = {
  title: string;
  detail: string;
  symbol: SymbolViewProps['name'];
  onPress: () => void;
};

export function AgendaRow({ title, detail, symbol, onPress }: AgendaRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
        <SymbolView name={symbol} size={18} tintColor={theme.secondary} />
      </View>
      <View style={styles.texts}>
        <ThemedText type="bodyStrong" numberOfLines={1}>
          {title}
        </ThemedText>
        <ThemedText type="bodySmall" themeColor="textSecondary" numberOfLines={1}>
          {detail}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  badge: {
    width: ICON_BADGE_SIZE,
    height: ICON_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
