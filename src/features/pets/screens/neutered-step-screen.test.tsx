import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { NeuteredStepScreen } from "./neutered-step-screen"

const next = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.next") }),
  )
const reason = (key: string) =>
  screen.queryByRole("radio", {
    name: translate(`newCompanion.neutered.${key}`),
  })

describe("NeuteredStepScreen", () => {
  it("asks whether the pet is neutered, not yet by default", async () => {
    await renderInCompanionForm(<NeuteredStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.neutered.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("newCompanion.neutered.notYet")),
    ).toBeOnTheScreen()
    expect(screen.getByRole("switch")).not.toBeChecked()
  })

  it("asks for a reason when the pet is not neutered", async () => {
    await renderInCompanionForm(<NeuteredStepScreen onNext={jest.fn()} />)

    expect(reason("tooYoung")).toBeOnTheScreen()
    expect(reason("breedPlans")).toBeOnTheScreen()
    expect(reason("healthConcerns")).toBeOnTheScreen()
    expect(reason("other")).toBeOnTheScreen()
  })

  it("does not move on without a reason", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(
      <NeuteredStepScreen onNext={onNext} />,
      makePet({ isNeutered: false, notNeuteredReason: undefined }),
    )

    await next()

    expect(
      await screen.findByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
    expect(onNext).not.toHaveBeenCalled()
  })

  it("moves on once a reason is chosen", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<NeuteredStepScreen onNext={onNext} />)

    await fireEvent.press(reason("tooYoung") as never)
    await next()

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })

  it("hides the reasons and moves on when the pet is neutered", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<NeuteredStepScreen onNext={onNext} />)

    await fireEvent.press(screen.getByRole("switch"))

    expect(
      screen.getByText(translate("newCompanion.neutered.yes")),
    ).toBeOnTheScreen()
    expect(reason("tooYoung")).not.toBeOnTheScreen()

    await next()
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })
})
