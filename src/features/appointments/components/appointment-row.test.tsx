import { AppointmentStatus, AppointmentType } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makeAppointment } from "@/test/factories/make-appointment"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { AppointmentRow } from "./appointment-row"

describe("AppointmentRow", () => {
  it("shows the type, the provider with the date and the status", async () => {
    await renderWithProviders(
      <AppointmentRow
        appointment={makeAppointment({
          appointmentType: AppointmentType.DENTAL,
          provider: { name: "Dr. Smith" },
          status: AppointmentStatus.CONFIRMED,
          scheduledAt: new Date(2026, 5, 20, 10, 30),
        })}
      />,
    )

    expect(
      screen.getByText(translate("appointment.types.dental")),
    ).toBeOnTheScreen()
    expect(screen.getByText(/^Dr\. Smith · 20 jun 2026/)).toBeOnTheScreen()
    expect(
      screen.getByText(translate("appointment.status.confirmed")),
    ).toBeOnTheScreen()
  })

  it("accepts a date serialized as text", async () => {
    await renderWithProviders(
      <AppointmentRow
        appointment={makeAppointment({
          provider: { name: "Dr. Smith" },
          scheduledAt: new Date(
            2026,
            5,
            20,
            10,
            30,
          ).toISOString() as unknown as Date,
        })}
      />,
    )

    expect(screen.getByText(/^Dr\. Smith · 20 jun 2026/)).toBeOnTheScreen()
  })
})
