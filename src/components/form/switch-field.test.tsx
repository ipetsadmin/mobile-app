import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"

import { SwitchField } from "./switch-field"

async function setup(
  isNeutered: boolean,
  onValueChange?: (value: boolean) => void,
) {
  return renderWithForm({ isNeutered }, (control) => (
    <SwitchField
      control={control}
      name="isNeutered"
      label="Neutered"
      onLabel="Yes"
      offLabel="No"
      onValueChange={onValueChange}
    />
  ))
}

describe("SwitchField", () => {
  it("shows the off label when the value is false", async () => {
    await setup(false)

    expect(screen.getByText("No")).toBeOnTheScreen()
    expect(screen.queryByText("Yes")).not.toBeOnTheScreen()
  })

  it("shows the on label when the value is true", async () => {
    await setup(true)

    expect(screen.getByText("Yes")).toBeOnTheScreen()
  })

  it("writes the new value into the form and notifies the caller", async () => {
    const onValueChange = jest.fn()
    const { form } = await setup(false, onValueChange)

    await fireEvent.press(screen.getByRole("switch"))

    expect(form().getValues("isNeutered")).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith(true)
    expect(screen.getByText("Yes")).toBeOnTheScreen()
  })
})
