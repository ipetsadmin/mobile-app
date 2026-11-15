import { fireEvent, screen } from "@testing-library/react-native"

import {
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NotificationsScreen } from "./notifications-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const inDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(12, 0, 0, 0)

  return date
}

describe("NotificationsScreen", () => {
  it("shows a spinner while loading", async () => {
    apiClient.users.getAgenda.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(<NotificationsScreen />)

    expect(
      screen.queryByText(translate("notifications.empty")),
    ).not.toBeOnTheScreen()
    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.users.getAgenda.mockRejectedValueOnce(new Error("boom"))
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

    await renderWithProviders(<NotificationsScreen />)
    expect(
      await screen.findByText(translate("common.loadError")),
    ).toBeOnTheScreen()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText("Amoxicillin · Luna")).toBeOnTheScreen()
  })

  it("shows the empty text without notifications", async () => {
    apiClient.users.getAgenda.mockResolvedValue(ok({ items: [] }))

    await renderWithProviders(<NotificationsScreen />)

    expect(
      await screen.findByText(translate("notifications.empty")),
    ).toBeOnTheScreen()
  })

  it("lists the upcoming items of the next 30 days", async () => {
    apiClient.users.getAgenda.mockResolvedValue(
      ok({
        items: [
          makeDoseItem({
            medicationName: "Amoxicillin",
            petName: "Luna",
            occursAt: inDays(1),
          }),
          makeBirthdayItem({
            petName: "Rocky",
            ageTurning: 4,
            occursAt: inDays(10),
          }),
        ],
      }),
    )

    await renderWithProviders(<NotificationsScreen />)

    expect(await screen.findByText("Amoxicillin · Luna")).toBeOnTheScreen()
    expect(
      screen.getByText(translate("agenda.birthday", { pet: "Rocky", age: 4 })),
    ).toBeOnTheScreen()
    expect(apiClient.users.getAgenda).toHaveBeenCalledWith("session-cookie", 30)
  })
})
