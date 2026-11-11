import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/button";
import { Spacing } from "@/constants/theme";
import { usePhotoPicker } from "@/hooks/use-photo-picker";

import { PetPhotoPreview } from "../components/pet-photo-preview";
import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";
import { useSaveCompanion } from "../hooks/use-save-companion";

type PhotoStepScreenProps = {
  petId?: string;
  onSaved: () => void;
};

export function PhotoStepScreen({ petId, onSaved }: PhotoStepScreenProps) {
  const { t } = useTranslation();
  const { submit, isPending } = useSaveCompanion({ petId, onSaved });
  const { control, goNext, setValue } = useCompanionStep({
    fields: ["photoUri"],
    onNext: submit,
  });
  const photoUri = useWatch({ control, name: "photoUri" });
  const { takePhoto, chooseFromLibrary } = usePhotoPicker({
    onPhotoPicked: (uri) => setValue("photoUri", uri),
  });

  return (
    <StepScaffold
      step={9}
      title={t("newCompanion.photo.title")}
      subtitle={t("newCompanion.photo.subtitle")}
      actionLabel={petId ? t("editCompanion.submit") : t("common.finish")}
      isLoading={isPending}
      onNext={goNext}
    >
      <PetPhotoPreview
        uri={photoUri}
        accessibilityLabel={t("newCompanion.photo.previewLabel")}
      />
      <View style={styles.actions}>
        <Button
          variant="secondary"
          size="lg"
          title={t("newCompanion.photo.takePhoto")}
          onPress={takePhoto}
        />
        <Button
          variant="secondary"
          size="lg"
          title={t("newCompanion.photo.chooseFromLibrary")}
          onPress={chooseFromLibrary}
        />
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.sm,
  },
});
