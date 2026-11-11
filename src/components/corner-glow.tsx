import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function CornerGlow() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.glow,
        {
          experimental_backgroundImage: `radial-gradient(circle at top right, ${theme.glow} 0%, transparent 70%)`,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 360,
    height: 360,
    pointerEvents: 'none',
  },
});
