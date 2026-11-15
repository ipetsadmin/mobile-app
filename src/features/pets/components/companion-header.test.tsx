import { Gender } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionHeader } from "./companion-header"

describe("CompanionHeader", () => {
  it("shows the name and the breed with the gender", async () => {
    const pet = makePet({ name: "Rocky", gender: Gender.MALE })

    await renderWithProviders(<CompanionHeader pet={pet} />)

    expect(screen.getByText("Rocky")).toBeOnTheScreen()
    expect(
      screen.getByText(`${pet.breed} · ${translate("gender.male")}`),
    ).toBeOnTheScreen()
  })
})
