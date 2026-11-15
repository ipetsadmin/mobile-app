import { Gender, WeightUnit } from "@ipetsadmin/contracts"
import { fireEvent, screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionCard } from "./companion-card"

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 5, 15))
})

afterEach(() => {
  jest.useRealTimers()
})

const pet = makePet({
  name: "Luna",
  gender: Gender.FEMALE,
  weight: 12.5,
  weightUnit: WeightUnit.KG,
  birthDate: { ...makePet().birthDate, date: new Date(2023, 2, 10) },
})

describe("CompanionCard", () => {
  it("shows the name and the breed", async () => {
    await renderWithProviders(<CompanionCard pet={pet} onPress={jest.fn()} />)

    expect(screen.getByText("Luna")).toBeOnTheScreen()
    expect(screen.getByText(pet.breed)).toBeOnTheScreen()
  })

  it("summarizes age, gender and weight", async () => {
    await renderWithProviders(<CompanionCard pet={pet} onPress={jest.fn()} />)

    const expected = [
      translate("companions.age.years", { count: 3 }),
      translate("gender.female"),
      `12.5 ${translate("weightUnit.kg")}`,
    ].join(" · ")

    expect(screen.getByText(expected)).toBeOnTheScreen()
  })

  it("shows the age in months for a young pet", async () => {
    const puppy = makePet({
      birthDate: { ...pet.birthDate, date: new Date(2026, 2, 10) },
    })
    await renderWithProviders(<CompanionCard pet={puppy} onPress={jest.fn()} />)

    expect(
      screen.getByText(
        new RegExp(`^${translate("companions.age.months", { count: 3 })}`),
      ),
    ).toBeOnTheScreen()
  })

  it("is a button labelled with the name and calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<CompanionCard pet={pet} onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "Luna" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
