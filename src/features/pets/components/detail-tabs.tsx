import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type DetailTab<T extends string> = {
  value: T;
  label: string;
};

type DetailTabsProps<T extends string> = {
  tabs: DetailTab<T>[];
  value: T;
  progress: SharedValue<number>;
  onChange: (value: T) => void;
};

export function DetailTabs<T extends string>({
  tabs,
  value,
  progress,
  onChange,
}: DetailTabsProps<T>) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const tabWidth = width / tabs.length;
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * tabWidth }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.list, { borderBottomColor: theme.border }]}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <ThemedText type={selected ? "button" : "body"}>
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, backgroundColor: theme.secondary },
          indicatorStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    minHeight: 44,
    paddingVertical: Spacing.sm,
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    height: 2,
  },
  pressed: {
    opacity: 0.6,
  },
});
