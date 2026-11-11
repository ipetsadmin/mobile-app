import { useEffect, useRef, useState } from 'react';
import {
  Easing,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Motion } from '@/constants/theme';

export const LAST_STAGE = 3;

const easing = Easing.bezier(0.77, 0, 0.175, 1);

const INTRO_DURATION_MS = Motion.introMorph * 4 + Motion.introHold * 3;

const toStage = (stage: number, delay = 0) =>
  withDelay(delay, withTiming(stage, { duration: Motion.introMorph, easing }));

type UseIntroTimelineArgs = {
  isReady: boolean;
  onFinished: () => void;
};

export function useIntroTimeline({ isReady, onFinished }: UseIntroTimelineArgs) {
  const progress = useSharedValue(-1);
  const exit = useSharedValue(0);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const hasStartedExit = useRef(false);

  useEffect(() => {
    progress.set(
      withSequence(
        toStage(0),
        toStage(1, Motion.introHold),
        toStage(2, Motion.introHold),
        toStage(LAST_STAGE, Motion.introHold),
      ),
    );
  }, [progress]);

  useEffect(() => {
    const timer = setTimeout(() => setIsIntroDone(true), INTRO_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isIntroDone || !isReady || hasStartedExit.current) return;

    hasStartedExit.current = true;
    exit.set(
      withDelay(
        Motion.introLogoHold,
        withTiming(1, { duration: Motion.introExit, easing }, (finished) => {
          if (finished) scheduleOnRN(onFinished);
        }),
      ),
    );
  }, [isIntroDone, isReady, exit, onFinished]);

  return { progress, exit };
}
