import { DogBreed, Species } from "@ipetsadmin/contracts"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { BreedStepScreen } from "./breed-step-screen"

const openBreeds = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("newCompanion.breed.label") }),
  )

describe("BreedStepScreen", () => {
  it("asks for the breed as the third step", async () => {
    await renderInCompanionForm(<BreedStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.breed.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 3, total: 9 }),
      ),
    ).toBeOnTheScreen()
  })

  it("shows the placeholder while no breed is chosen", async () => {
    await renderInCompanionForm(
      <BreedStepScreen onNext={jest.fn()} />,
      makePet({ breed: undefined as never }),
    )

    expect(
      screen.getByText(translate("newCompanion.breed.placeholder")),
    ).toBeOnTheScreen()
  })

  it("shows the empty text when there is no species yet", async () => {
    await renderInCompanionForm(<BreedStepScreen onNext={jest.fn()} />)

    await openBreeds()

    expect(
      screen.getByText(translate("newCompanion.breed.empty")),
    ).toBeOnTheScreen()
  })

  it("lists the breeds of the chosen species and filters them", async () => {
    await renderInCompanionForm(
      <BreedStepScreen onNext={jest.fn()} />,
      makePet({ species: Species.DOG, breed: undefined as never }),
    )

    await openBreeds()
    await fireEvent.changeText(
      screen.getByLabelText(translate("newCompanion.breed.searchPlaceholder")),
      "pastor",
    )

    expect(
      screen.getByRole("radio", { name: DogBreed.PASTOR_ALEMAN }),
    ).toBeOnTheScreen()
    expect(
      screen.queryByRole("radio", { name: DogBreed.LABRADOR_RETRIEVER }),
    ).not.toBeOnTheScreen()
  })

  it("does not move on without a breed", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(
      <BreedStepScreen onNext={onNext} />,
      makePet({ breed: undefined as never }),
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.next") }),
    )

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("moves on with a chosen breed", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(
      <BreedStepScreen onNext={onNext} />,
      makePet({ species: Species.DOG, breed: undefined as never }),
    )

    await openBreeds()
    await fireEvent.press(
      screen.getByRole("radio", { name: DogBreed.LABRADOR_RETRIEVER }),
    )
    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.next") }),
    )

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })
})
