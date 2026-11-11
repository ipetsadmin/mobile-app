import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type AuthHeaderProps = {
  title: string;
  subtitle: string;
  showBrandMark?: boolean;
};

export function AuthHeader({ title, subtitle, showBrandMark = false }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {showBrandMark && <BrandMark />}
      <ThemedText type="title" accessibilityRole="header">
        {title}
      </ThemedText>
      <ThemedText type="body">{subtitle}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
});
