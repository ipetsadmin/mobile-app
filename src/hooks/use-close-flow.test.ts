import { useNavigation } from "expo-router"

import { renderHookWithProviders } from "@/test/render-with-providers"

import { useCloseFlow } from "./use-close-flow"

jest.mock("expo-router", () => ({ useNavigation: jest.fn() }))

describe("useCloseFlow", () => {
  it("goes back from the parent navigator to leave the whole flow", async () => {
    const parent = { goBack: jest.fn() }
    const navigation = { getParent: () => parent, goBack: jest.fn() }
    jest.mocked(useNavigation).mockReturnValue(navigation as never)
    const { result } = await renderHookWithProviders(() => useCloseFlow())

    result.current()

    expect(parent.goBack).toHaveBeenCalledTimes(1)
    expect(navigation.goBack).not.toHaveBeenCalled()
  })

  it("goes back from the current navigator when there is no parent", async () => {
    const navigation = { getParent: () => undefined, goBack: jest.fn() }
    jest.mocked(useNavigation).mockReturnValue(navigation as never)
    const { result } = await renderHookWithProviders(() => useCloseFlow())

    result.current()

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })
})
