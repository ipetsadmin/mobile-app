import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SettingsSwitchRow } from "./settings-switch-row"

describe("SettingsSwitchRow", () => {
  it("shows the label and the description", async () => {
    await renderWithProviders(
      <SettingsSwitchRow
        label="Push"
        description="Reminders on this device"
        value={false}
        onValueChange={jest.fn()}
      />,
    )

    expect(screen.getByText("Push")).toBeOnTheScreen()
    expect(screen.getByText("Reminders on this device")).toBeOnTheScreen()
  })

  it("omits the description when there is none", async () => {
    await renderWithProviders(
      <SettingsSwitchRow
        label="Push"
        value={false}
        onValueChange={jest.fn()}
      />,
    )

    expect(screen.queryByText("Reminders on this device")).not.toBeOnTheScreen()
  })

  it("reflects the value in the switch", async () => {
    await renderWithProviders(
      <SettingsSwitchRow label="Push" value onValueChange={jest.fn()} />,
    )

    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("reports the new value when toggled", async () => {
    const onValueChange = jest.fn()
    await renderWithProviders(
      <SettingsSwitchRow
        label="Push"
        value={false}
        onValueChange={onValueChange}
      />,
    )

    await fireEvent.press(screen.getByRole("switch"))

    expect(onValueChange).toHaveBeenCalledWith(true)
  })
})
