import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { StatusMessage } from "./status-message"

const hasSpinner = () =>
  JSON.stringify(screen.toJSON()).includes("ActivityIndicator")

describe("StatusMessage", () => {
  it("shows a spinner when there is no message", async () => {
    await renderWithProviders(<StatusMessage />)

    expect(hasSpinner()).toBe(true)
  })

  it("shows the message instead of the spinner", async () => {
    await renderWithProviders(<StatusMessage message="Could not load" />)

    expect(screen.getByText("Could not load")).toBeOnTheScreen()
    expect(hasSpinner()).toBe(false)
  })

  it("offers an action and calls it when pressed", async () => {
    const onAction = jest.fn()
    await renderWithProviders(
      <StatusMessage
        message="Could not load"
        actionLabel="Retry"
        onAction={onAction}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Retry" }))

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it("hides the action without a handler", async () => {
    await renderWithProviders(
      <StatusMessage message="Could not load" actionLabel="Retry" />,
    )

    expect(screen.queryByRole("button")).not.toBeOnTheScreen()
  })

  it("hides the action without a label", async () => {
    await renderWithProviders(
      <StatusMessage message="Could not load" onAction={jest.fn()} />,
    )

    expect(screen.queryByRole("button")).not.toBeOnTheScreen()
  })
})
