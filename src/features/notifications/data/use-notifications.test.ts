import { waitFor } from "@testing-library/react-native"

import {
  makeAppointmentItem,
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useNotifications } from "./use-notifications"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const inDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(12, 0, 0, 0)

  return date
}

describe("useNotifications", () => {
  it("asks for the next 30 days of the agenda", async () => {
    apiClient.users.getAgenda.mockResolvedValue(ok({ items: [] }))

    const { result } = await renderHookWithProviders(() => useNotifications())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.users.getAgenda).toHaveBeenCalledWith("session-cookie", 30)
  })

  it("has no notifications for an empty agenda", async () => {
    apiClient.users.getAgenda.mockResolvedValue(ok({ items: [] }))

    const { result } = await renderHookWithProviders(() => useNotifications())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.notifications).toEqual([])
  })

  it("turns each agenda item into a notification", async () => {
    apiClient.users.getAgenda.mockResolvedValue(
      ok({
        items: [
          makeDoseItem({
            medicationName: "Amoxicillin",
            petName: "Luna",
            occursAt: inDays(1),
          }),
        ],
      }),
    )

    const { result } = await renderHookWithProviders(() => useNotifications())

    await waitFor(() => expect(result.current.notifications).toHaveLength(1))
    expect(result.current.notifications[0]).toMatchObject({
      id: expect.stringMatching(/^dose-/),
      title: "Amoxicillin · Luna",
      timeLabel: "Mañana",
    })
  })

  it("marks as urgent what happens in less than three days", async () => {
    apiClient.users.getAgenda.mockResolvedValue(
      ok({
        items: [
          makeBirthdayItem({ petId: "a", occursAt: inDays(0) }),
          makeBirthdayItem({ petId: "b", occursAt: inDays(2) }),
          makeBirthdayItem({ petId: "c", occursAt: inDays(3) }),
          makeAppointmentItem({ occursAt: inDays(10) }),
        ],
      }),
    )

    const { result } = await renderHookWithProviders(() => useNotifications())

    await waitFor(() => expect(result.current.notifications).toHaveLength(4))
    expect(result.current.notifications.map((item) => item.isUrgent)).toEqual([
      true,
      true,
      false,
      false,
    ])
  })

  it("keeps the agenda order", async () => {
    apiClient.users.getAgenda.mockResolvedValue(
      ok({
        items: [
          makeBirthdayItem({ petId: "later", occursAt: inDays(5) }),
          makeBirthdayItem({ petId: "sooner", occursAt: inDays(1) }),
        ],
      }),
    )

    const { result } = await renderHookWithProviders(() => useNotifications())

    await waitFor(() => expect(result.current.notifications).toHaveLength(2))
    expect(result.current.notifications[0].id).toContain("sooner")
  })
})
