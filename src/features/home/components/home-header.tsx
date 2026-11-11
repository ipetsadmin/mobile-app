import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HomeHeaderProps = {
  onOpenNotifications: () => void;
};

export function HomeHeader({ onOpenNotifications }: HomeHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <BrandMark size={36} tone="text" />
        <ThemedText type="heading">{t('common.brandName')}</ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.notifications')}
        hitSlop={Spacing.xs}
        onPress={onOpenNotifications}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <SymbolView
          name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
          size={20}
          weight="medium"
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.6,
  },
});
