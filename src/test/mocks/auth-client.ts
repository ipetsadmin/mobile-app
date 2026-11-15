import { sessionState } from "./session"

export const authClient = {
  useSession: () => ({ data: sessionState.current, isPending: false }),
  signIn: { email: jest.fn(), social: jest.fn() },
  signUp: { email: jest.fn() },
  signOut: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
}

const endpoints = [
  authClient.signIn.email,
  authClient.signIn.social,
  authClient.signUp.email,
  authClient.signOut,
  authClient.requestPasswordReset,
  authClient.resetPassword,
  authClient.changePassword,
]

beforeEach(() => {
  for (const endpoint of endpoints) endpoint.mockReset()
})
