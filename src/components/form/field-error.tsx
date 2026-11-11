import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';

type FieldErrorProps = {
  errorKey?: string;
};

export function FieldError({ errorKey }: FieldErrorProps) {
  const { t } = useTranslation();

  if (!errorKey) {
    return null;
  }

  return (
    <ThemedText type="bodySmall" themeColor="accent">
      {t(errorKey)}
    </ThemedText>
  );
}
