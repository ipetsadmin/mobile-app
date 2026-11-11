import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, type ButtonVariant } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type PlaceholderAction = {
  label: string;
  variant?: ButtonVariant;
  onPress: () => void;
};

type PlaceholderScreenProps = {
  eyebrow?: string;
  title: string;
  actions: PlaceholderAction[];
};

export function PlaceholderScreen({ eyebrow, title, actions }: PlaceholderScreenProps) {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          {eyebrow && (
            <ThemedText type="label" themeColor="textSecondary">
              {eyebrow}
            </ThemedText>
          )}
          <ThemedText type="title">{title}</ThemedText>
          {actions.map((action) => (
            <Button
              key={action.label}
              title={action.label}
              variant={action.variant}
              onPress={action.onPress}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
