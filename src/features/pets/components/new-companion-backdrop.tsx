import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

const MARK_SIZE = 200;
const ICON_CENTER = 48;

export function NewCompanionBackdrop() {
  const theme = useTheme();
  const clear = `${theme.primary}00`;
  const glows = [
    `radial-gradient(circle at 10% 125%, ${theme.primary} 0%, ${clear} 45%)`,
    `radial-gradient(circle at 78% 140%, ${theme.primary} 0%, ${clear} 42%)`,
  ];

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.muted }]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { experimental_backgroundImage: glows.join(", ") },
        ]}
      />
      <Image
        source={require("@/assets/icons/logo.svg")}
        tintColor={theme.primarySubdued}
        contentFit="contain"
        blurRadius={8}
        accessible={false}
        style={styles.mark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    position: "absolute",
    top: "50%",
    left: ICON_CENTER - MARK_SIZE / 2,
    width: MARK_SIZE,
    height: MARK_SIZE,
    marginTop: -MARK_SIZE / 2,
    opacity: 0.85,
  },
});
