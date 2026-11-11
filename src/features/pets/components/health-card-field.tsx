import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

type HealthCardFieldProps = {
  label: string;
  value: string;
};

export function HealthCardField({ label, value }: HealthCardFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText type="label">{label}</ThemedText>
      <ThemedText type="button" selectable>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    gap: Spacing["2xs"],
  },
});
