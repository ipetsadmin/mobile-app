import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { WeightStepScreen } from "./weight-step-screen"

const weight = () =>
  screen.getByLabelText(translate("newCompanion.weight.label"))
const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )

describe("WeightStepScreen", () => {
  it("asks for the weight with kilograms and pounds", async () => {
    await renderInCompanionForm(<WeightStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.weight.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("newCompanion.weight.note")),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", { name: translate("weightUnit.kg") }),
    ).toBeSelected()
    expect(
      screen.getByRole("radio", { name: translate("weightUnit.lb") }),
    ).not.toBeSelected()
  })

  it("switches the unit", async () => {
    await renderInCompanionForm(<WeightStepScreen onNext={jest.fn()} />)

    await fireEvent.press(
      screen.getByRole("radio", { name: translate("weightUnit.lb") }),
    )

    expect(
      screen.getByRole("radio", { name: translate("weightUnit.lb") }),
    ).toBeSelected()
  })

  it("does not move on without a weight", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<WeightStepScreen onNext={onNext} />)

    await next()

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("rejects a weight that is not a number", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<WeightStepScreen onNext={onNext} />)

    await fireEvent.changeText(weight(), "abc")
    await next()

    expect(
      await screen.findByText(translate("validation.weightInvalid")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each(["12", "12.5", "12,5"])(
    "moves on with the weight %s",
    async (value) => {
      const onNext = jest.fn()
      await renderInCompanionForm(<WeightStepScreen onNext={onNext} />)

      await fireEvent.changeText(weight(), value)
      await next()

      await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    },
  )
})
