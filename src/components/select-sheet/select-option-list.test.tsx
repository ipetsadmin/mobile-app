import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SelectOptionList } from "./select-option-list"

const options = [
  { value: "lab", label: "Labrador" },
  { value: "poodle", label: "Poodle" },
]

describe("SelectOptionList", () => {
  it("lists every option", async () => {
    await renderWithProviders(
      <SelectOptionList
        options={options}
        emptyText="Nothing"
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("marks the selected option", async () => {
    await renderWithProviders(
      <SelectOptionList
        options={options}
        selectedValue="poodle"
        emptyText="Nothing"
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByRole("radio", { name: "Poodle" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Labrador" })).not.toBeSelected()
  })

  it("reports the value of the pressed option", async () => {
    const onSelect = jest.fn()
    await renderWithProviders(
      <SelectOptionList
        options={options}
        emptyText="Nothing"
        onSelect={onSelect}
      />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Labrador" }))

    expect(onSelect).toHaveBeenCalledWith("lab")
  })

  it("shows the empty text when there are no options", async () => {
    await renderWithProviders(
      <SelectOptionList
        options={[]}
        emptyText="Nothing"
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByText("Nothing")).toBeOnTheScreen()
    expect(screen.queryByRole("radio")).not.toBeOnTheScreen()
  })
})
