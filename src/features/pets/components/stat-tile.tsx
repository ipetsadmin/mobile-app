import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type StatTileProps = {
  label: string;
  value: string;
};

export function StatTile({ label, value }: StatTileProps) {
  const theme = useTheme();

  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <ThemedText type="label">{label}</ThemedText>
      <ThemedText type="subheading" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: "40%",
    flexGrow: 1,
    gap: Spacing["2xs"],
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.control,
    borderCurve: "continuous",
  },
  value: {
    textTransform: "capitalize",
  },
});
