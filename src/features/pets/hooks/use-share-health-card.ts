import { useTranslation } from "react-i18next";
import { Share } from "react-native";

export function useShareHealthCard(petName?: string) {
  const { t } = useTranslation();

  return () =>
    Share.share({ message: t("healthCard.shareMessage", { name: petName }) });
}
