import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useResendVerification } from '../data/use-resend-verification';

const RESEND_COOLDOWN_SECONDS = 30;
const ONE_SECOND_MS = 1000;

export function useResendCode(email: string) {
  const { t } = useTranslation();
  const { mutate, isPending } = useResendVerification();
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), ONE_SECOND_MS);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const resend = () => {
    if (secondsLeft > 0 || isPending) return;

    mutate(email, {
      onSuccess: () => {
        toast.success(t('verifyAccount.resent'));
        setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      },
      onError: () => toast.error(t('verifyAccount.error')),
    });
  };

  return { resend, secondsLeft, isPending };
}
