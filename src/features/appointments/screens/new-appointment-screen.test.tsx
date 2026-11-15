import { AppointmentStatus, AppointmentType } from "@ipetsadmin/contracts"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { makeAppointment } from "@/test/factories/make-appointment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NewAppointmentScreen } from "./new-appointment-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const field = (key: string) => screen.getByLabelText(translate(key))
const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("appointment.submit") }),
  )

const fillAppointment = async () => {
  await fireEvent.press(
    screen.getByRole("button", { name: translate("appointment.type") }),
  )
  await fireEvent.press(
    screen.getByRole("radio", { name: translate("appointment.types.dental") }),
  )
  await fireEvent.changeText(field("appointment.provider"), "Dr. Smith")
  await fireEvent.changeText(field("appointment.location"), "Happy Paws")
  await fireEvent.changeText(field("appointment.address"), "1 Main St")
  await fireEvent.changeText(field("appointment.city"), "Bogota")
}

describe("NewAppointmentScreen", () => {
  it("shows every field of the appointment", async () => {
    await renderWithProviders(
      <NewAppointmentScreen petId="pet-1" onAppointmentSaved={jest.fn()} />,
    )

    for (const key of [
      "appointment.provider",
      "appointment.location",
      "appointment.address",
      "appointment.city",
      "appointment.reason",
    ]) {
      expect(field(key)).toBeOnTheScreen()
    }
  })

  it("lists the appointment types in the selector", async () => {
    await renderWithProviders(
      <NewAppointmentScreen petId="pet-1" onAppointmentSaved={jest.fn()} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("appointment.type") }),
    )

    expect(screen.getAllByRole("radio")).toHaveLength(
      Object.values(AppointmentType).length,
    )
  })

  it("does not save an incomplete appointment", async () => {
    await renderWithProviders(
      <NewAppointmentScreen petId="pet-1" onAppointmentSaved={jest.fn()} />,
    )

    await submit()

    expect(
      await screen.findByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
    expect(apiClient.pets.createAppointment).not.toHaveBeenCalled()
  })

  it("saves a pending appointment for the pet and notifies the caller", async () => {
    apiClient.pets.createAppointment.mockResolvedValue(ok(makeAppointment()))
    const onAppointmentSaved = jest.fn()
    await renderWithProviders(
      <NewAppointmentScreen
        petId="pet-1"
        onAppointmentSaved={onAppointmentSaved}
      />,
    )

    await fillAppointment()
    await submit()

    await waitFor(() => expect(onAppointmentSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.pets.createAppointment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({
        ownerId: "user-1",
        appointmentType: AppointmentType.DENTAL,
        status: AppointmentStatus.PENDING,
        provider: { name: "Dr. Smith" },
      }),
    )
  })

  it("shows an error and stays open when saving fails", async () => {
    apiClient.pets.createAppointment.mockRejectedValue(new Error("boom"))
    const onAppointmentSaved = jest.fn()
    await renderWithProviders(
      <NewAppointmentScreen
        petId="pet-1"
        onAppointmentSaved={onAppointmentSaved}
      />,
    )

    await fillAppointment()
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translate("appointment.error")),
    )
    expect(onAppointmentSaved).not.toHaveBeenCalled()
  })
})
