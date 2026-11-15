import { AppointmentType } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"
import { makeAppointment } from "@/test/factories/make-appointment"
import { fillForm } from "@/test/fill-form"
import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useAppointmentForm } from "./use-appointment-form"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const futureDate = new Date("2099-06-20T10:00:00.000Z")

const values = {
  appointmentType: AppointmentType.VETERINARY,
  scheduledAt: futureDate,
  providerName: "Dr. Smith",
  locationName: "Happy Paws",
  address: "1 Main St",
  city: "Bogota",
}

async function setup() {
  const onAppointmentSaved = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useAppointmentForm({ petId: "pet-1", onAppointmentSaved }),
  )

  return { ...hook, onAppointmentSaved }
}

describe("useAppointmentForm", () => {
  it("starts with the current time rounded up to a half hour", async () => {
    const { result } = await setup()

    const scheduledAt = result.current.control._formValues.scheduledAt as Date

    expect(scheduledAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 1000)
    expect(scheduledAt.getTime() % (30 * 60 * 1000)).toBe(0)
  })

  it("does not create the appointment while the form is invalid", async () => {
    const { result, onAppointmentSaved } = await setup()

    await act(async () => {
      await result.current.submit()
    })

    expect(apiClient.pets.createAppointment).not.toHaveBeenCalled()
    expect(onAppointmentSaved).not.toHaveBeenCalled()
  })

  it("creates the appointment for the pet and notifies the caller", async () => {
    apiClient.pets.createAppointment.mockResolvedValue(ok(makeAppointment()))
    const { result, onAppointmentSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(apiClient.pets.createAppointment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({ ownerId: "user-1", scheduledAt: futureDate }),
    )
    expect(onAppointmentSaved).toHaveBeenCalledTimes(1)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("shows an error and keeps the form open when creating fails", async () => {
    apiClient.pets.createAppointment.mockRejectedValue(new Error("boom"))
    const { result, onAppointmentSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("appointment.error"))
    expect(onAppointmentSaved).not.toHaveBeenCalled()
  })
})
