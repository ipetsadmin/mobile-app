import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const PREVIEW_SIZE = 200;

type PetPhotoPreviewProps = {
  uri?: string;
  accessibilityLabel: string;
};

export function PetPhotoPreview({
  uri,
  accessibilityLabel,
}: PetPhotoPreviewProps) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.preview,
        { backgroundColor: theme.backgroundSelected, borderColor: theme.muted },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          transition={200}
          style={styles.photo}
        />
      ) : (
        <SymbolView
          name={{
            ios: "camera.fill",
            android: "photo_camera",
            web: "photo_camera",
          }}
          size={32}
          tintColor={theme.primary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});
