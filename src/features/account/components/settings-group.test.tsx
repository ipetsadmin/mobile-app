import { screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SettingsGroup } from "./settings-group"

describe("SettingsGroup", () => {
  it("shows the label followed by a dot and its rows", async () => {
    await renderWithProviders(
      <SettingsGroup label="Account">
        <Text>row</Text>
      </SettingsGroup>,
    )

    expect(screen.getByText("Account ·")).toBeOnTheScreen()
    expect(screen.getByText("row")).toBeOnTheScreen()
  })
})
