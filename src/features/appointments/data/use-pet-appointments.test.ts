import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makeAppointment } from "@/test/factories/make-appointment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { usePetAppointments } from "./use-pet-appointments"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("usePetAppointments", () => {
  it("loads the appointments of the pet", async () => {
    const appointment = makeAppointment()
    apiClient.pets.getAppointments.mockResolvedValue(ok([appointment]))

    const { result } = await renderHookWithProviders(() =>
      usePetAppointments("pet-1"),
    )

    await waitFor(() => expect(result.current.data).toEqual([appointment]))
    expect(apiClient.pets.getAppointments).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
    )
  })

  it("returns an empty list when the response has no data", async () => {
    apiClient.pets.getAppointments.mockResolvedValue({ success: true })

    const { result } = await renderHookWithProviders(() =>
      usePetAppointments("pet-1"),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it("stores the result under the list key of the pet", async () => {
    apiClient.pets.getAppointments.mockResolvedValue(ok([]))

    const { result, queryClient } = await renderHookWithProviders(() =>
      usePetAppointments("pet-1"),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.appointments.list("pet-1")),
    ).toBeDefined()
  })

  it("surfaces API errors", async () => {
    apiClient.pets.getAppointments.mockRejectedValue(new Error("boom"))

    const { result } = await renderHookWithProviders(() =>
      usePetAppointments("pet-1"),
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
