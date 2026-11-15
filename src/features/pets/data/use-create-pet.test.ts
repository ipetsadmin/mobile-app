import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makeCompanionValues } from "@/test/factories/make-companion-values"
import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { toCreatePetBody } from "./to-create-pet-body"
import { useCreatePet } from "./use-create-pet"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values = makeCompanionValues()

describe("useCreatePet", () => {
  it("creates the pet for the signed in user and returns it", async () => {
    const pet = makePet({ id: "pet-new" })
    apiClient.users.createPet.mockResolvedValue(ok(pet))
    const { result } = await renderHookWithProviders(() => useCreatePet())

    let created: unknown
    await act(async () => {
      created = await result.current.mutateAsync(values)
    })

    expect(created).toEqual(pet)
    expect(apiClient.users.createPet).toHaveBeenCalledWith(
      "session-cookie",
      "user-1",
      toCreatePetBody(values),
    )
  })

  it("invalidates the pets and the agenda", async () => {
    apiClient.users.createPet.mockResolvedValue(ok(makePet()))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreatePet(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(invalidated()).toEqual([queryKeys.pets.all, queryKeys.agenda.all])
  })

  it("fails when the response has no pet", async () => {
    apiClient.users.createPet.mockResolvedValue({ success: true })
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreatePet(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow(
        "Missing created pet",
      )
    })

    expect(invalidated()).toEqual([])
  })

  it("fails without a session and does not call the API", async () => {
    sessionState.current = null
    const { result } = await renderHookWithProviders(() => useCreatePet())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow(
        "Missing session",
      )
    })

    expect(apiClient.users.createPet).not.toHaveBeenCalled()
  })
})
