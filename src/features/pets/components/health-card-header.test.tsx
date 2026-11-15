import { Gender } from "@ipetsadmin/contracts"
import { fireEvent, screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { HealthCardHeader } from "./health-card-header"

describe("HealthCardHeader", () => {
  it("shows the name and the breed with the gender", async () => {
    const pet = makePet({ name: "Luna", gender: Gender.FEMALE })

    await renderWithProviders(
      <HealthCardHeader pet={pet} onShare={jest.fn()} />,
    )

    expect(screen.getByText("Luna")).toBeOnTheScreen()
    expect(
      screen.getByText(`${pet.breed} · ${translate("gender.female")}`),
    ).toBeOnTheScreen()
  })

  it("shares the card", async () => {
    const onShare = jest.fn()
    await renderWithProviders(
      <HealthCardHeader pet={makePet()} onShare={onShare} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("healthCard.share") }),
    )

    expect(onShare).toHaveBeenCalledTimes(1)
  })
})
