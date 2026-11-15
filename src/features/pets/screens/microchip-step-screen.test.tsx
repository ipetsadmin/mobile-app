import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { MicrochipStepScreen } from "./microchip-step-screen"

const chip = () =>
  screen.getByLabelText(translate("newCompanion.microchip.label"))
const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )

describe("MicrochipStepScreen", () => {
  it("asks for the microchip as the eighth step", async () => {
    await renderInCompanionForm(<MicrochipStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.microchip.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 8, total: 9 }),
      ),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("newCompanion.microchip.hint")),
    ).toBeOnTheScreen()
  })

  it("lets the user skip it", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<MicrochipStepScreen onNext={onNext} />)

    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("accepts a number with spaces", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<MicrochipStepScreen onNext={onNext} />)

    await fireEvent.changeText(chip(), "985 112 000 123")
    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("rejects letters", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<MicrochipStepScreen onNext={onNext} />)

    await fireEvent.changeText(chip(), "ABC123")
    await next()

    expect(
      await screen.findByText(translate("validation.microchipInvalid")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })
})
