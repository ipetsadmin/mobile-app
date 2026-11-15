import type { QueryClient, QueryKey } from "@tanstack/react-query"

export function spyOnInvalidations(queryClient: QueryClient) {
  const spy = jest.spyOn(queryClient, "invalidateQueries")

  return (): QueryKey[] =>
    spy.mock.calls.map(([filters]) => filters?.queryKey ?? [])
}
