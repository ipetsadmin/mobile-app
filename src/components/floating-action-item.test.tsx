import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { FloatingActionItem } from "./floating-action-item"

const action = {
  key: "vaccine",
  label: "Add vaccine",
  icon: { ios: "syringe", android: "vaccines", web: "vaccines" } as const,
  onPress: jest.fn(),
}

describe("FloatingActionItem", () => {
  it("shows the label of the action as a button", async () => {
    await renderWithProviders(
      <FloatingActionItem action={action} delay={0} onPress={jest.fn()} />,
    )

    expect(
      screen.getByRole("button", { name: "Add vaccine" }),
    ).toBeOnTheScreen()
    expect(screen.getByText("Add vaccine")).toBeOnTheScreen()
  })

  it("calls the onPress it receives", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <FloatingActionItem action={action} delay={40} onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Add vaccine" }))

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(action.onPress).not.toHaveBeenCalled()
  })
})
