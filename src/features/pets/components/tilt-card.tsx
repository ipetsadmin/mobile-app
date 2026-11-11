import type { ReactNode } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Motion } from "@/constants/theme";

const MAX_TILT_DEGREES = 12;
const DEGREES_PER_POINT = 0.12;
const PERSPECTIVE = 900;
const PRESSED_SCALE = 1.02;
const SETTLE = { duration: Motion.slow, dampingRatio: 0.8 };

function clampTilt(value: number) {
  "worklet";
  return Math.max(-MAX_TILT_DEGREES, Math.min(MAX_TILT_DEGREES, value));
}

type TiltCardProps = {
  children: ReactNode;
};

export function TiltCard({ children }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .enabled(!reducedMotion)
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      scale.set(withTiming(PRESSED_SCALE, { duration: Motion.fast }));
    })
    .onUpdate((event) => {
      tiltY.set(clampTilt(event.translationX * DEGREES_PER_POINT));
      tiltX.set(clampTilt(-event.translationY * DEGREES_PER_POINT));
    })
    .onFinalize(() => {
      tiltX.set(withSpring(0, SETTLE));
      tiltY.set(withSpring(0, SETTLE));
      scale.set(withTiming(1, { duration: Motion.fast }));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: `${tiltX.get()}deg` },
      { rotateY: `${tiltY.get()}deg` },
      { scale: scale.get() },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
