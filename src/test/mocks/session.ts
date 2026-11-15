export type TestSession = {
  user: { id: string; email: string; name: string }
}

export const testSession: TestSession = {
  user: { id: "user-1", email: "ana@example.com", name: "Ana Gomez" },
}

export const sessionState: { current: TestSession | null } = {
  current: testSession,
}

export function resetSession() {
  sessionState.current = testSession
}
