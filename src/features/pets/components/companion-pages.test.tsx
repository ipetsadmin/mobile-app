import { screen } from "@testing-library/react-native"

import { makeAppointment } from "@/test/factories/make-appointment"
import { makePet } from "@/test/factories/make-pet"
import { makeTreatment } from "@/test/factories/make-treatment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionPages } from "./companion-pages"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const props = {
  pet: makePet({ id: "pet-1", name: "Luna" }),
  caretakerName: "Ana Gomez",
  pagerRef: { current: null },
  onPageScroll: jest.fn(),
  onPageSelected: jest.fn(),
}

describe("CompanionPages", () => {
  it("renders the overview, health and appointments pages", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([makeTreatment({ medicationName: "Amoxicillin" })]),
    )
    apiClient.pets.getAppointments.mockResolvedValue(ok([makeAppointment()]))

    await renderWithProviders(<CompanionPages {...props} />)

    expect(screen.getByText("Ana Gomez")).toBeOnTheScreen()
    expect(screen.getByText(translate("treatment.listTitle"))).toBeOnTheScreen()
    expect(screen.getByText(translate("vaccine.listTitle"))).toBeOnTheScreen()
    expect(await screen.findAllByText("Amoxicillin")).not.toHaveLength(0)
  })

  it("requests the treatments and the appointments of the pet", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(ok([]))
    apiClient.pets.getAppointments.mockResolvedValue(ok([]))

    await renderWithProviders(<CompanionPages {...props} />)

    await screen.findByText(translate("appointment.empty"))
    expect(apiClient.pets.getTreatments).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
    )
    expect(apiClient.pets.getAppointments).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
    )
  })
})
