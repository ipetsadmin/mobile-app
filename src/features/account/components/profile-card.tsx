import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AccountAvatar } from './account-avatar';

const MARK_SIZE = 200;

type ProfileCardProps = {
  name: string;
  email: string;
  photoUri?: string;
  onPress: () => void;
};

export function ProfileCard({ name, email, photoUri, onPress }: ProfileCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.muted, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <Image
        source={require('@/assets/icons/logo.svg')}
        tintColor={theme.primarySubdued}
        contentFit="contain"
        blurRadius={8}
        accessible={false}
        style={styles.mark}
      />
      <AccountAvatar name={name} photoUri={photoUri} />
      <View style={styles.texts}>
        <ThemedText type="bodyStrong" numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText type="bodySmall" numberOfLines={1}>
          {email}
        </ThemedText>
      </View>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={12}
        weight="semibold"
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 88,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  mark: {
    position: 'absolute',
    top: '50%',
    right: -MARK_SIZE / 2 + Spacing.lg,
    width: MARK_SIZE,
    height: MARK_SIZE,
    marginTop: -MARK_SIZE / 2 + Spacing.md,
    opacity: 0.85,
  },
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
