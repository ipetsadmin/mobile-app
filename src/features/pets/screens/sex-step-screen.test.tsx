import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { SexStepScreen } from "./sex-step-screen"

const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )

describe("SexStepScreen", () => {
  it("asks for the sex as the fourth step", async () => {
    await renderInCompanionForm(<SexStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", { name: translate("newCompanion.sex.title") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 4, total: 9 }),
      ),
    ).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("does not move on without choosing", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<SexStepScreen onNext={onNext} />)

    await next()

    expect(
      await screen.findByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("moves on once one is chosen", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<SexStepScreen onNext={onNext} />)

    await fireEvent.press(
      screen.getByRole("radio", { name: translate("gender.male") }),
    )
    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("preselects the sex of an existing pet", async () => {
    await renderInCompanionForm(<SexStepScreen onNext={jest.fn()} />, makePet())

    expect(
      screen.getByRole("radio", { name: translate("gender.female") }),
    ).toBeSelected()
  })
})
