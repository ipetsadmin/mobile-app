import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarArrow } from "./calendar-arrow"

describe("CalendarArrow", () => {
  it.each(["previous", "next"] as const)(
    "is announced with its %s label",
    async (direction) => {
      await renderWithProviders(
        <CalendarArrow
          direction={direction}
          label={`Go ${direction}`}
          disabled={false}
          onPress={jest.fn()}
        />,
      )

      expect(
        screen.getByRole("button", { name: `Go ${direction}` }),
      ).toBeOnTheScreen()
    },
  )

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <CalendarArrow
        direction="next"
        label="Next"
        disabled={false}
        onPress={onPress}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Next" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <CalendarArrow
        direction="next"
        label="Next"
        disabled
        onPress={onPress}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Next" }))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })
})
