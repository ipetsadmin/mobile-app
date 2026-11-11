import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSignIn } from '../data/use-sign-in';
import { useVerifyEmail } from '../data/use-verify-email';
import { verifyAccountSchema, type VerifyAccountValues } from '../schema/verify-account.schema';
import { clearPendingCredentials, getPendingPassword } from '../utils/pending-credentials';

type UseVerifyAccountFormArgs = {
  email: string;
  onGoToSignIn: () => void;
};

export function useVerifyAccountForm({ email, onGoToSignIn }: UseVerifyAccountFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<VerifyAccountValues>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: { code: '' },
  });
  const verify = useVerifyEmail();
  const signIn = useSignIn();

  const goToSignIn = () => {
    clearPendingCredentials();
    onGoToSignIn();
  };

  const signInAfterVerify = () => {
    const password = getPendingPassword(email);

    if (!password) {
      goToSignIn();
      return;
    }

    signIn.mutate(
      { email, password },
      {
        onSuccess: clearPendingCredentials,
        onError: () => {
          clearPendingCredentials();
          toast.error(t('verifyAccount.errors.signIn'));
        },
      },
    );
  };

  return {
    control,
    goToSignIn,
    isPending: verify.isPending || signIn.isPending,
    isSigningIn: signIn.isPending,
    submit: handleSubmit(({ code }) => {
      if (verify.isSuccess) {
        signInAfterVerify();
        return;
      }

      verify.mutate(
        { email, otp: code },
        {
          onSuccess: () => {
            toast.success(t('verifyAccount.verified'));
            signInAfterVerify();
          },
          onError: () => toast.error(t('verifyAccount.errors.invalidCode')),
        },
      );
    }),
  };
}
