import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { OptionList } from "./option-list"

const options = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
]

describe("OptionList", () => {
  it("lists every option under an accessible label", async () => {
    await renderWithProviders(
      <OptionList
        label="Language"
        options={options}
        value="en"
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByLabelText("Language")).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("marks only the current value", async () => {
    await renderWithProviders(
      <OptionList
        label="Language"
        options={options}
        value="es"
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByRole("radio", { name: "Español" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "English" })).not.toBeSelected()
  })

  it("reports the value of the pressed option", async () => {
    const onChange = jest.fn()
    await renderWithProviders(
      <OptionList
        label="Language"
        options={options}
        value="en"
        onChange={onChange}
      />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Español" }))

    expect(onChange).toHaveBeenCalledWith("es")
  })
})
