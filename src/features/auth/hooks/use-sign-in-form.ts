import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useResendVerification } from '../data/use-resend-verification';
import { useSignIn } from '../data/use-sign-in';
import { useSocialSignIn } from '../data/use-social-sign-in';
import { signInSchema, type SignInValues } from '../schema/sign-in.schema';
import { getSignInErrorKey } from '../utils/get-sign-in-error-key';
import { setPendingCredentials } from '../utils/pending-credentials';

const EMAIL_NOT_VERIFIED_STATUS = 403;

type UseSignInFormArgs = {
  onEmailNotVerified: (email: string) => void;
};

export function useSignInForm({ onEmailNotVerified }: UseSignInFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const { mutate, isPending } = useSignIn();
  const { mutate: sendCode } = useResendVerification();
  const social = useSocialSignIn();

  const showError = (error: unknown) => toast.error(t(getSignInErrorKey(error)));

  return {
    control,
    isPending,
    continueWith: (provider: Parameters<typeof social.mutate>[0]) =>
      social.mutate(provider, { onError: showError }),
    submit: handleSubmit((values) =>
      mutate(values, {
        onError: (error) => {
          if ((error as { status?: number }).status !== EMAIL_NOT_VERIFIED_STATUS) {
            showError(error);
            return;
          }

          const email = values.email.trim();
          setPendingCredentials(email, values.password);
          sendCode(email);
          onEmailNotVerified(email);
        },
      }),
    ),
    focusPassword: () => setFocus('password'),
  };
}
