import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

type SplashPhraseProps = {
  text: string;
  stage: number;
  progress: SharedValue<number>;
};

export function SplashPhrase({ text, stage, progress }: SplashPhraseProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const range = [stage - 0.5, stage, stage + 0.5];

    return {
      opacity: interpolate(progress.get(), range, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(progress.get(), range, [8, 0, -8], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ThemedText type="heading" themeColor="primary">
        {text}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
