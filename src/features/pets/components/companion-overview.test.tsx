import { WeightUnit } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { makeTreatment } from "@/test/factories/make-treatment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionOverview } from "./companion-overview"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

beforeEach(() => {
  jest.useFakeTimers({
    doNotFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "setImmediate",
      "clearImmediate",
      "nextTick",
      "queueMicrotask",
    ],
  })
  jest.setSystemTime(new Date(2026, 5, 15))
  apiClient.pets.getTreatments.mockResolvedValue(ok([]))
})

afterEach(() => {
  jest.useRealTimers()
})

const pet = makePet({
  weight: 12.5,
  weightUnit: WeightUnit.KG,
  isNeutered: true,
  microchipNumber: "985112000123",
  birthDate: { ...makePet().birthDate, date: new Date(2023, 2, 10) },
  beenWithUsSince: { ...makePet().beenWithUsSince, date: new Date(2026, 5, 5) },
})

describe("CompanionOverview", () => {
  it("shows the time together, age, birth date and weight", async () => {
    await renderWithProviders(
      <CompanionOverview pet={pet} caretakerName="Ana Gomez" />,
    )

    expect(
      screen.getByText(translate("healthCard.days", { count: 10 })),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("companions.age.years", { count: 3 })),
    ).toBeOnTheScreen()
    expect(screen.getByText("10 mar 2023")).toBeOnTheScreen()
    expect(
      screen.getByText(`12.5 ${translate("weightUnit.kg")}`),
    ).toBeOnTheScreen()
  })

  it("shows the caretaker and the microchip", async () => {
    await renderWithProviders(
      <CompanionOverview pet={pet} caretakerName="Ana Gomez" />,
    )

    expect(screen.getByText("Ana Gomez")).toBeOnTheScreen()
    expect(screen.getByText("985112000123")).toBeOnTheScreen()
  })

  it("says there is no microchip when the pet has none", async () => {
    await renderWithProviders(
      <CompanionOverview
        pet={{ ...pet, microchipNumber: undefined }}
        caretakerName="Ana"
      />,
    )

    expect(
      screen.getByText(translate("healthCard.noMicrochip")),
    ).toBeOnTheScreen()
  })

  it.each([
    [true, "common.yes"],
    [false, "common.no"],
  ])("shows whether the pet is neutered (%s)", async (isNeutered, key) => {
    await renderWithProviders(
      <CompanionOverview pet={{ ...pet, isNeutered }} caretakerName="Ana" />,
    )

    expect(screen.getByText(translate(key))).toBeOnTheScreen()
  })

  it("lists the active treatments above the stats", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([makeTreatment({ medicationName: "Amoxicillin" })]),
    )

    await renderWithProviders(
      <CompanionOverview pet={pet} caretakerName="Ana" />,
    )

    expect(await screen.findByText("Amoxicillin")).toBeOnTheScreen()
  })
})
