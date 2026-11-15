import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { NameStepScreen } from "./name-step-screen"

const nameInput = () =>
  screen.getByLabelText(translate("newCompanion.name.label"))
const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )

describe("NameStepScreen", () => {
  it("asks for the name as the second step", async () => {
    await renderInCompanionForm(<NameStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.name.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 2, total: 9 }),
      ),
    ).toBeOnTheScreen()
    expect(nameInput()).toBeOnTheScreen()
  })

  it("does not move on without a name", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<NameStepScreen onNext={onNext} />)

    await next()

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("moves on with a name", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<NameStepScreen onNext={onNext} />)

    await fireEvent.changeText(nameInput(), "Luna")
    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("moves on from the keyboard", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<NameStepScreen onNext={onNext} />)

    await fireEvent.changeText(nameInput(), "Luna")
    await fireEvent(nameInput(), "submitEditing")

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("clears the error once the user types a name", async () => {
    await renderInCompanionForm(<NameStepScreen onNext={jest.fn()} />)

    await next()
    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()

    await fireEvent.changeText(nameInput(), "Luna")

    await waitFor(() =>
      expect(
        screen.queryByText(translate("validation.required")),
      ).not.toBeOnTheScreen(),
    )
  })

  it("starts with the name of an existing pet when editing", async () => {
    await renderInCompanionForm(
      <NameStepScreen onNext={jest.fn()} />,
      makePet({ name: "Rocky" }),
    )

    expect(nameInput()).toHaveDisplayValue("Rocky")
  })
})
