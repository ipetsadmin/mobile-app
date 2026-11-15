import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { StatTile } from "./stat-tile"

describe("StatTile", () => {
  it("shows the label and the value", async () => {
    await renderWithProviders(<StatTile label="Weight" value="12.5 kg" />)

    expect(screen.getByText("Weight")).toBeOnTheScreen()
    expect(screen.getByText("12.5 kg")).toBeOnTheScreen()
  })
})
