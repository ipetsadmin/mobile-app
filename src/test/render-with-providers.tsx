import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, renderHook } from "@testing-library/react-native"
import type { ComponentType, ReactElement, ReactNode } from "react"
import { I18nextProvider } from "react-i18next"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { i18n } from "@/lib/i18n"

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
}

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
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

type InnerWrapper = ComponentType<{ children: ReactNode }>

function createWrapper(queryClient: QueryClient, Inner?: InnerWrapper) {
  i18n.changeLanguage("es")

  return ({ children }: { children: ReactNode }) =>
    TestProviders({
      queryClient,
      children: Inner ? <Inner>{children}</Inner> : children,
    })
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
  Inner?: InnerWrapper,
) {
  const result = await renderHook(callback, {
    wrapper: createWrapper(queryClient, Inner),
  })

  return { ...result, queryClient }
}
