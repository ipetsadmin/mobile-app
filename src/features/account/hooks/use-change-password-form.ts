import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useChangePassword } from '../data/use-change-password';
import { changePasswordSchema, type ChangePasswordValues } from '../schema/change-password.schema';

const INVALID_PASSWORD_CODE = 'INVALID_PASSWORD';

type UseChangePasswordFormArgs = {
  onPasswordChanged: () => void;
};

export function useChangePasswordForm({ onPasswordChanged }: UseChangePasswordFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const { mutate, isPending } = useChangePassword();

  return {
    control,
    setFocus,
    isPending,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: onPasswordChanged,
        onError: (error) =>
          toast.error(
            t(
              (error as { code?: string }).code === INVALID_PASSWORD_CODE
                ? 'account.password.invalidCurrent'
                : 'account.password.genericError',
            ),
          ),
      }),
    ),
  };
}
