import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type NoteProps = {
  text: string;
};

export function Note({ text }: NoteProps) {
  const theme = useTheme();

  return (
    <View style={[styles.note, { backgroundColor: theme.backgroundSelected }]}>
      <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
      <ThemedText type="bodySmall" style={styles.text}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.card,
    borderCurve: "continuous",
  },
  dot: {
    width: 8,
    height: 8,
    marginTop: (Typography.bodySmall.lineHeight - 8) / 2,
    borderRadius: Radius.pill,
  },
  text: {
    flex: 1,
  },
});
