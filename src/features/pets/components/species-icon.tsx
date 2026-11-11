import { Species } from "@ipetsadmin/contracts";
import { Image } from "expo-image";

const sources = {
  [Species.DOG]: require("@/assets/icons/dog.svg"),
  [Species.CAT]: require("@/assets/icons/cat.svg"),
};

type SpeciesIconProps = {
  species: Species;
  size?: number;
};

export function SpeciesIcon({ species, size = 24 }: SpeciesIconProps) {
  return (
    <Image
      source={sources[species]}
      contentFit="contain"
      accessible={false}
      style={{ width: size, height: size }}
    />
  );
}
