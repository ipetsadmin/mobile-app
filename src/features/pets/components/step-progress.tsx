import { StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type StepProgressProps = {
  current: number;
  total: number;
};

export function StepProgress({ current, total }: StepProgressProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: current }}
      style={styles.container}
    >
      {Array.from({ length: total }, (_, index) => {
        const isReached = index < current;
        const isLast = index === total - 1;

        return (
          <View
            key={index}
            style={[styles.segment, isLast && styles.lastSegment]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: isReached ? theme.primary : theme.muted },
              ]}
            />
            {!isLast && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index < current - 1 ? theme.primary : theme.muted,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 12,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  lastSegment: {
    flex: 0,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    transform: [{ rotate: "-35deg" }, { scaleX: 1.5 }],
  },
  line: {
    flex: 1,
    height: 1,
  },
});
