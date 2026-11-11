import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSetNewPassword } from '../data/use-set-new-password';
import { newPasswordSchema, type NewPasswordValues } from '../schema/new-password.schema';

type UseNewPasswordFormArgs = {
  token: string;
  onPasswordSet: () => void;
};

export function useNewPasswordForm({ token, onPasswordSet }: UseNewPasswordFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });
  const { mutate, isPending } = useSetNewPassword();

  return {
    control,
    isPending,
    focusConfirm: () => setFocus('confirmPassword'),
    submit: handleSubmit(({ newPassword }) =>
      mutate(
        { token, newPassword },
        {
          onSuccess: () => {
            toast.success(t('newPassword.success'));
            onPasswordSet();
          },
          onError: () => toast.error(t('newPassword.error')),
        },
      ),
    ),
  };
}
