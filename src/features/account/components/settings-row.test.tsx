import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SettingsRow } from "./settings-row"

describe("SettingsRow", () => {
  it("shows the label and the value", async () => {
    await renderWithProviders(
      <SettingsRow label="Email" value="ana@example.com" />,
    )

    expect(screen.getByText("Email")).toBeOnTheScreen()
    expect(screen.getByText("ana@example.com")).toBeOnTheScreen()
  })

  it("is plain text, not a button, without a handler", async () => {
    await renderWithProviders(
      <SettingsRow label="Email" value="ana@example.com" />,
    )

    expect(screen.queryByRole("button")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Email")).toHaveAccessibilityValue({
      text: "ana@example.com",
    })
  })

  it("is a button that calls onPress when it has a handler", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <SettingsRow label="Password" onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Password" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("has no value text when none is given", async () => {
    await renderWithProviders(
      <SettingsRow label="Password" onPress={jest.fn()} />,
    )

    expect(
      screen.getByRole("button", { name: "Password" }),
    ).not.toHaveAccessibilityValue({ text: "x" })
  })
})
