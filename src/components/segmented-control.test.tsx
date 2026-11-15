import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SegmentedControl } from "./segmented-control"

const options = [
  { value: "kg", label: "Kilograms" },
  { value: "lb", label: "Pounds" },
]

describe("SegmentedControl", () => {
  it("groups the options under an accessible label", async () => {
    await renderWithProviders(
      <SegmentedControl label="Unit" options={options} onChange={jest.fn()} />,
    )

    expect(screen.getByLabelText("Unit")).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("marks only the current value as selected", async () => {
    await renderWithProviders(
      <SegmentedControl
        label="Unit"
        options={options}
        value="lb"
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByRole("radio", { name: "Pounds" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Kilograms" })).not.toBeSelected()
  })

  it("selects nothing without a value", async () => {
    await renderWithProviders(
      <SegmentedControl label="Unit" options={options} onChange={jest.fn()} />,
    )

    expect(screen.getByRole("radio", { name: "Pounds" })).not.toBeSelected()
    expect(screen.getByRole("radio", { name: "Kilograms" })).not.toBeSelected()
  })

  it("reports the value of the pressed option", async () => {
    const onChange = jest.fn()
    await renderWithProviders(
      <SegmentedControl
        label="Unit"
        options={options}
        value="kg"
        onChange={onChange}
      />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Pounds" }))

    expect(onChange).toHaveBeenCalledWith("lb")
  })
})
