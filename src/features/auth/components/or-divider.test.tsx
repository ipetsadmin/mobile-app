import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { OrDivider } from "./or-divider"

describe("OrDivider", () => {
  it("shows its label", async () => {
    await renderWithProviders(<OrDivider label="or" />)

    expect(screen.getByText("or")).toBeOnTheScreen()
  })
})
