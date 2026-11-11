import { Image, StyleSheet, useWindowDimensions } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function SplashGrain() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <Image
      source={require('@/assets/images/splash-grain.png')}
      resizeMode="repeat"
      tintColor={theme.text}
      accessible={false}
      style={[styles.grain, { width, height }]}
    />
  );
}

const styles = StyleSheet.create({
  grain: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});
