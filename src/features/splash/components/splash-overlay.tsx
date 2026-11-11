import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, Extrapolation } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

import { useIntroTimeline } from '../hooks/use-intro-timeline';
import { useSplash } from '../hooks/use-splash';
import { SplashBlob } from './splash-blob';
import { SplashGrain } from './splash-grain';
import { SplashLogo } from './splash-logo';
import { SplashPhrase } from './splash-phrase';

const EXIT_SCALE = 9;

type SplashOverlayProps = {
  isReady: boolean;
};

export function SplashOverlay({ isReady }: SplashOverlayProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isFinished, finish } = useSplash();
  const { progress, exit } = useIntroTimeline({ isReady, onFinished: finish });
  const phrases = [t('splash.notOwn'), t('splash.notManaged'), t('splash.related')];

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exit.get(), [0.55, 1], [1, 0], Extrapolation.CLAMP),
  }));

  const stageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(exit.get(), [0, 1], [1, EXIT_SCALE]) }],
  }));

  if (isFinished) return null;

  return (
    <Animated.View
      accessible
      accessibilityLabel={t('common.brandName')}
      style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: theme.muted }, overlayStyle]}>
      <Animated.View style={[styles.stage, stageStyle]}>
        <SplashBlob progress={progress} />
        <SplashLogo progress={progress} />
      </Animated.View>
      <SplashGrain />
      {phrases.map((text, stage) => (
        <SplashPhrase key={stage} text={text} stage={stage} progress={progress} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
