import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AccountAvatarProps = {
  name: string;
  photoUri?: string;
  size?: number;
};

export function AccountAvatar({ name, photoUri, size = 56 }: AccountAvatarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, backgroundColor: theme.backgroundElement },
      ]}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} contentFit="cover" style={styles.photo} />
      ) : (
        <ThemedText type={size > 80 ? 'title' : 'subheading'}>{name.charAt(0)}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
