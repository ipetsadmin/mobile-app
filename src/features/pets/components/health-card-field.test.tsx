import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { HealthCardField } from "./health-card-field"

describe("HealthCardField", () => {
  it("shows the label and the value", async () => {
    await renderWithProviders(
      <HealthCardField label="Microchip" value="985112000123" />,
    )

    expect(screen.getByText("Microchip")).toBeOnTheScreen()
    expect(screen.getByText("985112000123")).toBeOnTheScreen()
  })

  it("lets the user select the value to copy it", async () => {
    await renderWithProviders(
      <HealthCardField label="Microchip" value="985112000123" />,
    )

    expect(screen.getByText("985112000123").props.selectable).toBe(true)
  })
})
