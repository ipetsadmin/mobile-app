import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AccountAvatar } from './account-avatar';

const AVATAR_SIZE = 120;
const BADGE_SIZE = 40;

type ProfilePhotoButtonProps = {
  name: string;
  photoUri?: string;
  label: string;
  onPress: () => void;
};

export function ProfilePhotoButton({ name, photoUri, label, onPress }: ProfilePhotoButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <AccountAvatar name={name} photoUri={photoUri} size={AVATAR_SIZE} />
      <View
        style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.background }]}>
        <SymbolView
          name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
          size={18}
          tintColor={theme.onPrimary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.7,
  },
});
