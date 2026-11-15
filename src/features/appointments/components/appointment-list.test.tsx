import { AppointmentStatus } from "@ipetsadmin/contracts"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makeAppointment } from "@/test/factories/make-appointment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { AppointmentList } from "./appointment-list"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const inDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return date
}

const appointment = (
  id: string,
  days: number,
  providerName: string,
  status = AppointmentStatus.PENDING,
) =>
  makeAppointment({
    id,
    scheduledAt: inDays(days),
    provider: { name: providerName },
    status,
  })

describe("AppointmentList", () => {
  it("shows a spinner while loading", async () => {
    apiClient.pets.getAppointments.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(<AppointmentList petId="pet-1" />)

    expect(
      screen.queryByText(translate("appointment.empty")),
    ).not.toBeOnTheScreen()
    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the empty text without appointments", async () => {
    apiClient.pets.getAppointments.mockResolvedValue(ok([]))

    await renderWithProviders(<AppointmentList petId="pet-1" />)

    expect(
      await screen.findByText(translate("appointment.empty")),
    ).toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.pets.getAppointments.mockRejectedValueOnce(new Error("boom"))
    apiClient.pets.getAppointments.mockResolvedValue(
      ok([appointment("a", 2, "Dr. Smith")]),
    )

    await renderWithProviders(<AppointmentList petId="pet-1" />)
    expect(
      await screen.findByText(translate("common.loadError")),
    ).toBeOnTheScreen()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText(/Dr\. Smith/)).toBeOnTheScreen()
    expect(apiClient.pets.getAppointments).toHaveBeenCalledTimes(2)
  })

  it("separates the upcoming from the past appointments", async () => {
    apiClient.pets.getAppointments.mockResolvedValue(
      ok([
        appointment("next", 3, "Dr. Next"),
        appointment("old", -3, "Dr. Old"),
      ]),
    )

    await renderWithProviders(<AppointmentList petId="pet-1" />)

    expect(
      await screen.findByText(translate("appointment.upcomingTitle")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("appointment.pastTitle")),
    ).toBeOnTheScreen()
    expect(screen.getByText(/Dr\. Next/)).toBeOnTheScreen()
    expect(screen.getByText(/Dr\. Old/)).toBeOnTheScreen()
  })

  it("hides the upcoming section when everything is in the past", async () => {
    apiClient.pets.getAppointments.mockResolvedValue(
      ok([appointment("old", -3, "Dr. Old")]),
    )

    await renderWithProviders(<AppointmentList petId="pet-1" />)

    expect(
      await screen.findByText(translate("appointment.pastTitle")),
    ).toBeOnTheScreen()
    expect(
      screen.queryByText(translate("appointment.upcomingTitle")),
    ).not.toBeOnTheScreen()
  })

  it("lists a cancelled future appointment as past", async () => {
    apiClient.pets.getAppointments.mockResolvedValue(
      ok([appointment("c", 5, "Dr. Cancelled", AppointmentStatus.CANCELLED)]),
    )

    await renderWithProviders(<AppointmentList petId="pet-1" />)

    await waitFor(() =>
      expect(
        screen.getByText(translate("appointment.pastTitle")),
      ).toBeOnTheScreen(),
    )
    expect(
      screen.queryByText(translate("appointment.upcomingTitle")),
    ).not.toBeOnTheScreen()
  })
})
