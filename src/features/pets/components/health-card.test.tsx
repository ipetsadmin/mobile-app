import { WeightUnit } from "@ipetsadmin/contracts"
import { fireEvent, screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { HealthCard } from "./health-card"

const pet = makePet({
  name: "Luna",
  weight: 12.5,
  weightUnit: WeightUnit.KG,
  microchipNumber: "985112000123",
  birthDate: { ...makePet().birthDate, date: new Date(2023, 2, 10) },
})

describe("HealthCard", () => {
  it("shows the birth date, weight, caretaker and microchip", async () => {
    await renderWithProviders(
      <HealthCard pet={pet} caretakerName="Ana Gomez" onShare={jest.fn()} />,
    )

    expect(screen.getByText("10 mar 2023")).toBeOnTheScreen()
    expect(
      screen.getByText(`12.5 ${translate("weightUnit.kg")}`),
    ).toBeOnTheScreen()
    expect(screen.getByText("Ana Gomez")).toBeOnTheScreen()
    expect(screen.getByText("985112000123")).toBeOnTheScreen()
  })

  it("says there is no microchip when the pet has none", async () => {
    await renderWithProviders(
      <HealthCard
        pet={{ ...pet, microchipNumber: undefined }}
        caretakerName="Ana Gomez"
        onShare={jest.fn()}
      />,
    )

    expect(
      screen.getByText(translate("healthCard.noMicrochip")),
    ).toBeOnTheScreen()
  })

  it("shares the card from its header", async () => {
    const onShare = jest.fn()
    await renderWithProviders(
      <HealthCard pet={pet} caretakerName="Ana Gomez" onShare={onShare} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("healthCard.share") }),
    )

    expect(onShare).toHaveBeenCalledTimes(1)
  })

  it("shows the brand footer", async () => {
    await renderWithProviders(
      <HealthCard pet={pet} caretakerName="Ana Gomez" onShare={jest.fn()} />,
    )

    expect(screen.getByText(translate("healthCard.tagline"))).toBeOnTheScreen()
    expect(screen.getByText(translate("common.brandName"))).toBeOnTheScreen()
  })
})
