import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { BirthDateStepScreen } from "./birth-date-step-screen"

describe("BirthDateStepScreen", () => {
  it("asks for the birth date as the fifth step", async () => {
    await renderInCompanionForm(<BirthDateStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.birthDate.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 5, total: 9 }),
      ),
    ).toBeOnTheScreen()
  })

  it("offers an exact or an approximate date, exact by default", async () => {
    await renderInCompanionForm(<BirthDateStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.birthDate.exact"),
      }),
    ).toBeSelected()
    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.birthDate.unsure"),
      }),
    ).not.toBeSelected()
  })

  it("switches to an approximate date", async () => {
    await renderInCompanionForm(<BirthDateStepScreen onNext={jest.fn()} />)

    await fireEvent.press(
      screen.getByRole("radio", {
        name: translate("newCompanion.birthDate.unsure"),
      }),
    )

    expect(
      screen.getByRole("radio", {
        name: translate("newCompanion.birthDate.unsure"),
      }),
    ).toBeSelected()
  })

  it("shows the calendar arrows next to the step button", async () => {
    await renderInCompanionForm(<BirthDateStepScreen onNext={jest.fn()} />)

    expect(
      screen.getByRole("button", { name: translate("common.previous") }),
    ).toBeOnTheScreen()
    expect(
      screen.getAllByRole("button", { name: translate("common.next") }),
    ).toHaveLength(2)
  })

  it("moves on with the default date", async () => {
    const onNext = jest.fn()
    await renderInCompanionForm(<BirthDateStepScreen onNext={onNext} />)

    await fireEvent.press(
      screen
        .getAllByRole("button", { name: translate("common.next") })
        .at(-1) as never,
    )

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
  })
})
