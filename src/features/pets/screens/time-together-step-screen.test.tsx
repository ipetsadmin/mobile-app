import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { TimeTogetherStepScreen } from "./time-together-step-screen"

describe("TimeTogetherStepScreen", () => {
  it("asks for the time together", async () => {
    await renderInCompanionForm(<TimeTogetherStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.timeTogether.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.sinceBirth"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.joinedLater"),
      }),
    ).toBeOnTheScreen()
  })

  it("is locked to the birth date when the birth date is exact", async () => {
    await renderInCompanionForm(<TimeTogetherStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.joinedLater"),
      }),
    ).toBeDisabled()
    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.sinceBirth"),
      }),
    ).toBeSelected()
  })

  it("lets the user choose when the birth date is approximate", async () => {
    const { BirthDateSource } = jest.requireActual("@ipetsadmin/contracts")
    const pet = makePet({
      birthDate: {
        ...makePet().birthDate,
        source: BirthDateSource.APPROXIMATED_DATE,
      },
    })
    await renderInCompanionForm(
      <TimeTogetherStepScreen onNext={jest.fn()} />,
      pet,
    )

    await fireEvent.press(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.joinedLater"),
      }),
    )

    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.timeTogether.joinedLater"),
      }),
    ).toBeSelected()
  })

  it("moves on with the values of an existing pet", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(
      <TimeTogetherStepScreen onNext={onNext} />,
      makePet(),
    )

    await fireEvent.press(
      screen
        .getAllByRole("button", { name: translate("common.next") })
        .at(-1) as never,
    )

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })
})
