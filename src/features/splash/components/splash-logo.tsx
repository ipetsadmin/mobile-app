import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { BrandMark } from '@/components/brand-mark';

import { LAST_STAGE } from '../hooks/use-intro-timeline';

const SOURCE_SIZE = 320;
const RESTING_SCALE = 0.25;

type SplashLogoProps = {
  progress: SharedValue<number>;
};

export function SplashLogo({ progress }: SplashLogoProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const range = [LAST_STAGE - 0.5, LAST_STAGE];

    return {
      opacity: interpolate(progress.get(), range, [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale:
            RESTING_SCALE * interpolate(progress.get(), range, [0.8, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.logo, animatedStyle]}>
      <BrandMark size={SOURCE_SIZE} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
  },
});
