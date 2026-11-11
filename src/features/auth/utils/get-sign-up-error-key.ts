const USER_ALREADY_EXISTS_STATUS = 422;

export function getSignUpErrorKey(error: unknown): string {
  const status = (error as { status?: number } | null)?.status;

  if (status === USER_ALREADY_EXISTS_STATUS) return 'signUp.errors.emailTaken';

  return 'signUp.errors.generic';
}
