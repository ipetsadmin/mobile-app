import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

const STAGES = [-1, 0, 1, 2, 3];
const SCALE_X = [0, 0.7, 0.5, 1.1, 1.2];
const SCALE_Y = [0, 0.45, 1, 0.65, 1.9];
const ROTATION = [-30, -14, 8, -26, -4];
const OFFSET_X = [0, 0, 6, -8, 0];
const OFFSET_Y = [0, 0, -10, 12, 0];

const clamp = Extrapolation.CLAMP;

type SplashBlobProps = {
  progress: SharedValue<number>;
};

export function SplashBlob({ progress }: SplashBlobProps) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const stage = progress.get();

    return {
      transform: [
        { translateX: interpolate(stage, STAGES, OFFSET_X, clamp) },
        { translateY: interpolate(stage, STAGES, OFFSET_Y, clamp) },
        { rotate: `${interpolate(stage, STAGES, ROTATION, clamp)}deg` },
        { scaleX: interpolate(stage, STAGES, SCALE_X, clamp) },
        { scaleY: interpolate(stage, STAGES, SCALE_Y, clamp) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.blob, animatedStyle]}>
      <Image
        source={require('@/assets/images/splash-blob.png')}
        tintColor={theme.background}
        contentFit="fill"
        accessible={false}
        style={styles.image}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: {
    width: 512,
    height: 512,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
