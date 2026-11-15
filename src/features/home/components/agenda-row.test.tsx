import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { AgendaRow } from "./agenda-row"

const symbol = { ios: "calendar", android: "event", web: "event" } as const

describe("AgendaRow", () => {
  it("shows the title and the detail under a single accessible label", async () => {
    await renderWithProviders(
      <AgendaRow
        title="Luna · cita"
        detail="Dr. Smith · 10:00"
        symbol={symbol}
        onPress={jest.fn()}
      />,
    )

    expect(
      screen.getByRole("button", { name: "Luna · cita. Dr. Smith · 10:00" }),
    ).toBeOnTheScreen()
    expect(screen.getByText("Luna · cita")).toBeOnTheScreen()
    expect(screen.getByText("Dr. Smith · 10:00")).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <AgendaRow
        title="Luna · cita"
        detail="10:00"
        symbol={symbol}
        onPress={onPress}
      />,
    )

    await fireEvent.press(screen.getByRole("button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
