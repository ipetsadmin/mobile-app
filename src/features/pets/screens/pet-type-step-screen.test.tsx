import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { PetTypeStepScreen } from "./pet-type-step-screen"

const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )

describe("PetTypeStepScreen", () => {
  it("asks for the pet type as the first step", async () => {
    await renderInCompanionForm(<PetTypeStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.petType.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 1, total: 9 }),
      ),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", { name: translate("species.dog") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", { name: translate("species.cat") }),
    ).toBeOnTheScreen()
  })

  it("does not move on without choosing", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<PetTypeStepScreen onNext={onNext} />)

    await next()

    expect(
      await screen.findByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("moves on once a type is chosen", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<PetTypeStepScreen onNext={onNext} />)

    await fireEvent.press(
      screen.getByRole("radio", { name: translate("species.cat") }),
    )
    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    expect(
      screen.getByRole("radio", { name: translate("species.cat") }),
    ).toBeSelected()
  })
})
