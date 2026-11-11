import type { Species } from "@ipetsadmin/contracts";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { SpeciesIcon } from "./species-icon";

type PetAvatarProps = {
  species: Species;
  photoUrl?: string;
};

export function PetAvatar({ species, photoUrl }: PetAvatarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.avatar,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.secondary,
        },
      ]}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          contentFit="cover"
          style={styles.photo}
        />
      ) : (
        <SpeciesIcon species={species} size={32} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});
