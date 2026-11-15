import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { PlaceholderScreen } from "./placeholder-screen"

describe("PlaceholderScreen", () => {
  it("shows the title", async () => {
    await renderWithProviders(
      <PlaceholderScreen title="Household" actions={[]} />,
    )

    expect(screen.getByText("Household")).toBeOnTheScreen()
  })

  it("shows the eyebrow only when given", async () => {
    await renderWithProviders(
      <PlaceholderScreen eyebrow="Soon" title="Household" actions={[]} />,
    )

    expect(screen.getByText("Soon")).toBeOnTheScreen()
  })

  it("renders one button per action and calls the pressed one", async () => {
    const onBack = jest.fn()
    const onOther = jest.fn()
    await renderWithProviders(
      <PlaceholderScreen
        title="Household"
        actions={[
          { label: "Back", variant: "secondary", onPress: onBack },
          { label: "Other", onPress: onOther },
        ]}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Back" }))

    expect(screen.getAllByRole("button")).toHaveLength(2)
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onOther).not.toHaveBeenCalled()
  })
})
