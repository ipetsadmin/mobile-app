import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"

import { SegmentedField } from "./segmented-field"

const options = [
  { value: "KG", label: "Kilograms" },
  { value: "LB", label: "Pounds" },
]

async function setup(weightUnit: string) {
  return renderWithForm({ weightUnit }, (control) => (
    <SegmentedField
      control={control}
      name="weightUnit"
      label="Unit"
      options={options}
    />
  ))
}

describe("SegmentedField", () => {
  it("selects the option matching the form value", async () => {
    await setup("LB")

    expect(screen.getByRole("radio", { name: "Pounds" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Kilograms" })).not.toBeSelected()
  })

  it("writes the pressed option into the form", async () => {
    const { form } = await setup("KG")

    await fireEvent.press(screen.getByRole("radio", { name: "Pounds" }))

    expect(form().getValues("weightUnit")).toBe("LB")
    expect(screen.getByRole("radio", { name: "Pounds" })).toBeSelected()
  })
})
