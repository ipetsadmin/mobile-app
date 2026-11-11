import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useRequestPasswordReset } from '../data/use-request-password-reset';
import { resetPasswordSchema, type ResetPasswordValues } from '../schema/reset-password.schema';

type UseResetPasswordFormArgs = {
  onRequested: () => void;
};

export function useResetPasswordForm({ onRequested }: UseResetPasswordFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });
  const { mutate, isPending } = useRequestPasswordReset();

  return {
    control,
    isPending,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: () => {
          toast.success(t('resetPassword.sent'));
          onRequested();
        },
        onError: () => toast.error(t('resetPassword.error')),
      }),
    ),
  };
}
