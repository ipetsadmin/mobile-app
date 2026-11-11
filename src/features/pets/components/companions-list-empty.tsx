import { useTranslation } from "react-i18next";

import { StatusMessage } from "@/components/status-message";

import { CompanionsEmptyState } from "./companions-empty-state";

type CompanionsListEmptyProps = {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onNewCompanion: () => void;
};

export function CompanionsListEmpty({
  isPending,
  isError,
  onRetry,
  onNewCompanion,
}: CompanionsListEmptyProps) {
  const { t } = useTranslation();

  if (isPending) return <StatusMessage />;

  if (isError) {
    return (
      <StatusMessage
        message={t("common.loadError")}
        actionLabel={t("common.retry")}
        onAction={onRetry}
      />
    );
  }

  return <CompanionsEmptyState onNewCompanion={onNewCompanion} />;
}
