import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { AccountAvatar } from "./account-avatar"

describe("AccountAvatar", () => {
  it("shows the first letter of the name without a photo", async () => {
    await renderWithProviders(<AccountAvatar name="Ana Gomez" />)

    expect(screen.getByText("A")).toBeOnTheScreen()
  })

  it("does not show the initial when there is a photo", async () => {
    await renderWithProviders(
      <AccountAvatar name="Ana Gomez" photoUri="https://img/a.jpg" />,
    )

    expect(screen.queryByText("A")).not.toBeOnTheScreen()
  })
})
