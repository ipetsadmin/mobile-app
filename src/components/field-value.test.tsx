import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { FieldValue } from "./field-value"

describe("FieldValue", () => {
  it("shows its text under an accessible label and value", async () => {
    await renderWithProviders(
      <FieldValue
        label="Birth date"
        text="Jun 15, 2026"
        symbol="calendar"
        onPress={jest.fn()}
      />,
    )

    expect(
      screen.getByRole("button", { name: "Birth date" }),
    ).toHaveAccessibilityValue({
      text: "Jun 15, 2026",
    })
    expect(screen.getByText("Jun 15, 2026")).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <FieldValue
        label="Birth date"
        text="Jun 15, 2026"
        symbol="chevron"
        onPress={onPress}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Birth date" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("is plain text, not a button, without a handler", async () => {
    await renderWithProviders(
      <FieldValue label="Birth date" text="Jun 15, 2026" symbol="chevron" />,
    )

    expect(screen.queryByRole("button")).not.toBeOnTheScreen()
    expect(screen.getByRole("text", { name: "Birth date" })).toBeOnTheScreen()
  })
})
