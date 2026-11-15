import { sessionState } from "./session"

export const useAuthSession = () => ({
  session: sessionState.current,
  isPending: false,
})
