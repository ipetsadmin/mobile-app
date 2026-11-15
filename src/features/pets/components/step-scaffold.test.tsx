import { fireEvent, screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { StepScaffold } from "./step-scaffold"

const props = {
  step: 3,
  title: "Name",
  subtitle: "What is their name?",
  onNext: jest.fn(),
}

describe("StepScaffold", () => {
  it("shows the title as a header, the subtitle and its children", async () => {
    await renderWithProviders(
      <StepScaffold {...props}>
        <Text>step content</Text>
      </StepScaffold>,
    )

    expect(screen.getByRole("header", { name: "Name" })).toBeOnTheScreen()
    expect(screen.getByText("What is their name?")).toBeOnTheScreen()
    expect(screen.getByText("step content")).toBeOnTheScreen()
  })

  it("tells which step of nine the user is on", async () => {
    await renderWithProviders(<StepScaffold {...props} />)

    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 3, total: 9 }),
      ),
    ).toBeOnTheScreen()
  })

  it("uses the next label by default and calls onNext", async () => {
    const onNext = jest.fn()
    await renderWithProviders(<StepScaffold {...props} onNext={onNext} />)

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.next") }),
    )

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("accepts a custom action label", async () => {
    await renderWithProviders(<StepScaffold {...props} actionLabel="Finish" />)

    expect(screen.getByRole("button", { name: "Finish" })).toBeOnTheScreen()
  })

  it("blocks the action while loading", async () => {
    const onNext = jest.fn()
    await renderWithProviders(
      <StepScaffold {...props} onNext={onNext} isLoading />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.next") }),
    )

    expect(onNext).not.toHaveBeenCalled()
  })
})
