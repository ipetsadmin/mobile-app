import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSignUp } from '../data/use-sign-up';
import { signUpSchema, type SignUpValues } from '../schema/sign-up.schema';
import { getSignUpErrorKey } from '../utils/get-sign-up-error-key';
import { setPendingCredentials } from '../utils/pending-credentials';

type UseSignUpFormArgs = {
  onSignedUp: (email: string) => void;
};

export function useSignUpForm({ onSignedUp }: UseSignUpFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });
  const { mutate, isPending } = useSignUp();

  return {
    control,
    isPending,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: () => {
          const email = values.email.trim();

          setPendingCredentials(email, values.password);
          onSignedUp(email);
        },
        onError: (error) => toast.error(t(getSignUpErrorKey(error))),
      }),
    ),
    focusField: (name: keyof SignUpValues) => setFocus(name),
  };
}
