import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { FloatingActionMenu } from "./floating-action-menu"

const actions = [
  {
    key: "vaccine",
    label: "Add vaccine",
    icon: { ios: "syringe", android: "vaccines", web: "vaccines" } as const,
    onPress: jest.fn(),
  },
  {
    key: "visit",
    label: "Add appointment",
    icon: { ios: "calendar", android: "event", web: "event" } as const,
    onPress: jest.fn(),
  },
]

describe("FloatingActionMenu", () => {
  it("starts closed, showing only the main button", async () => {
    await renderWithProviders(
      <FloatingActionMenu label="Add" actions={actions} />,
    )

    expect(screen.getByRole("button", { name: "Add" })).not.toBeExpanded()
    expect(
      screen.queryByRole("button", { name: "Add vaccine" }),
    ).not.toBeOnTheScreen()
  })

  it("opens to show every action", async () => {
    await renderWithProviders(
      <FloatingActionMenu label="Add" actions={actions} />,
    )

    await fireEvent.press(screen.getAllByRole("button", { name: "Add" })[0])

    expect(
      screen.getByRole("button", { name: "Add vaccine" }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("button", { name: "Add appointment" }),
    ).toBeOnTheScreen()
  })

  it("closes and runs the action that was pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <FloatingActionMenu label="Add" actions={[{ ...actions[0], onPress }]} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Add" }))
    await fireEvent.press(screen.getByRole("button", { name: "Add vaccine" }))

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(
      screen.queryByRole("button", { name: "Add vaccine" }),
    ).not.toBeOnTheScreen()
  })

  it("closes when the backdrop is pressed without running any action", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <FloatingActionMenu label="Add" actions={[{ ...actions[0], onPress }]} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Add" }))
    const [backdrop] = screen.getAllByRole("button", { name: "Add" })
    await fireEvent.press(backdrop)

    expect(onPress).not.toHaveBeenCalled()
    expect(
      screen.queryByRole("button", { name: "Add vaccine" }),
    ).not.toBeOnTheScreen()
  })

  it("toggles closed when the main button is pressed again", async () => {
    await renderWithProviders(
      <FloatingActionMenu label="Add" actions={actions} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Add" }))
    const buttons = screen.getAllByRole("button", { name: "Add" })
    await fireEvent.press(buttons[buttons.length - 1])

    expect(
      screen.queryByRole("button", { name: "Add vaccine" }),
    ).not.toBeOnTheScreen()
  })
})
