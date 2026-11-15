import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { TextButton } from "./text-button"

describe("TextButton", () => {
  it("shows the title as an accessible button", async () => {
    await renderWithProviders(
      <TextButton title="Sign out" onPress={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "Sign out" })).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<TextButton title="Sign out" onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "Sign out" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it.each(["subtle", "plain", "strong"] as const)(
    "renders the %s variant",
    async (variant) => {
      await renderWithProviders(
        <TextButton title="Sign out" variant={variant} onPress={jest.fn()} />,
      )

      expect(screen.getByText("Sign out")).toBeOnTheScreen()
    },
  )
})
