import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { AuthHeader } from "./auth-header"

describe("AuthHeader", () => {
  it("shows the title as a header and the subtitle", async () => {
    await renderWithProviders(
      <AuthHeader title="Welcome" subtitle="Sign in to continue" />,
    )

    expect(screen.getByRole("header", { name: "Welcome" })).toBeOnTheScreen()
    expect(screen.getByText("Sign in to continue")).toBeOnTheScreen()
  })

  it("can show the brand mark above the title", async () => {
    await renderWithProviders(
      <AuthHeader title="Welcome" subtitle="Sign in" showBrandMark />,
    )

    expect(screen.getByRole("header", { name: "Welcome" })).toBeOnTheScreen()
  })
})
