const EMAIL_NOT_VERIFIED_STATUS = 403;
const INVALID_CREDENTIALS_STATUS = 401;

export function getSignInErrorKey(error: unknown): string {
  const status = (error as { status?: number } | null)?.status;

  if (status === EMAIL_NOT_VERIFIED_STATUS) return 'signIn.errors.emailNotVerified';
  if (status === INVALID_CREDENTIALS_STATUS) return 'signIn.errors.invalidCredentials';

  return 'signIn.errors.generic';
}
