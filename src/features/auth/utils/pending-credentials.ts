type PendingCredentials = {
  email: string;
  password: string;
};

let pending: PendingCredentials | undefined;

export function setPendingCredentials(email: string, password: string) {
  pending = { email, password };
}

export function getPendingPassword(email: string) {
  return pending?.email === email ? pending.password : undefined;
}

export function clearPendingCredentials() {
  pending = undefined;
}
