import { AppointmentType } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makeAppointment } from "@/test/factories/make-appointment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import type { AppointmentValues } from "../schema/appointment.schema"
import { toCreateAppointmentBody } from "./to-create-appointment-body"
import { useCreateAppointment } from "./use-create-appointment"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values: AppointmentValues = {
  appointmentType: AppointmentType.VETERINARY,
  scheduledAt: new Date("2026-06-20T10:00:00.000Z"),
  providerName: "Dr. Smith",
  locationName: "Happy Paws",
  address: "1 Main St",
  city: "Bogota",
}

describe("useCreateAppointment", () => {
  it("creates the appointment for the pet with the owner from the session", async () => {
    apiClient.pets.createAppointment.mockResolvedValue(ok(makeAppointment()))
    const { result } = await renderHookWithProviders(() =>
      useCreateAppointment("pet-1"),
    )

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(apiClient.pets.createAppointment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      toCreateAppointmentBody("user-1", values),
    )
  })

  it("invalidates the appointments and the agenda so the home refreshes", async () => {
    apiClient.pets.createAppointment.mockResolvedValue(ok(makeAppointment()))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreateAppointment("pet-1"),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(invalidated()).toEqual([
      queryKeys.appointments.all,
      queryKeys.agenda.all,
    ])
  })

  it("does not invalidate when the request fails", async () => {
    apiClient.pets.createAppointment.mockRejectedValue(new Error("boom"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreateAppointment("pet-1"),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow("boom")
    })

    expect(invalidated()).toEqual([])
  })

  it("fails without a session and does not call the API", async () => {
    sessionState.current = null
    const { result } = await renderHookWithProviders(() =>
      useCreateAppointment("pet-1"),
    )

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow(
        "Missing session",
      )
    })

    expect(apiClient.pets.createAppointment).not.toHaveBeenCalled()
  })
})
