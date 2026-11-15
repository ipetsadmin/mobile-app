import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, renderHook } from "@testing-library/react-native"
import type { ReactElement, ReactNode } from "react"
import { I18nextProvider } from "react-i18next"

import { i18n } from "@/lib/i18n"

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

type TestProvidersProps = {
  queryClient: QueryClient
  children: ReactNode
}

function TestProviders({ queryClient, children }: TestProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  )
}

function createWrapper(queryClient: QueryClient) {
  i18n.changeLanguage("es")

  return ({ children }: { children: ReactNode }) =>
    TestProviders({ queryClient, children })
}

export async function renderWithProviders(
  ui: ReactElement,
  queryClient = createTestQueryClient(),
) {
  const result = await render(ui, { wrapper: createWrapper(queryClient) })

  return { ...result, queryClient }
}

export async function renderHookWithProviders<Result>(
  callback: () => Result,
  queryClient = createTestQueryClient(),
) {
  const result = await renderHook(callback, {
    wrapper: createWrapper(queryClient),
  })

  return { ...result, queryClient }
}
