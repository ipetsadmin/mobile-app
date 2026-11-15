import { act, fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import { OptionGroupField } from "./option-group-field"

const options = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
]

type ExtraProps = {
  layout?: "list" | "grid" | "inline"
  disabled?: boolean
  isLabelVisible?: boolean
  onValueChange?: (value: string) => void
}

async function setup(props: ExtraProps = {}, species = "") {
  return renderWithForm({ species }, (control) => (
    <OptionGroupField
      control={control}
      name="species"
      label="Species"
      options={options}
      {...props}
    />
  ))
}

describe("OptionGroupField", () => {
  it("groups the options under an accessible label", async () => {
    await setup()

    expect(screen.getByLabelText("Species")).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("hides the visible label unless asked", async () => {
    await setup()

    expect(screen.queryByText("Species ·")).not.toBeOnTheScreen()
  })

  it("shows the visible label when asked", async () => {
    await setup({ isLabelVisible: true })

    expect(screen.getByText("Species ·")).toBeOnTheScreen()
  })

  it("selects the option matching the form value", async () => {
    await setup({}, "Cat")

    expect(screen.getByRole("radio", { name: "Cat" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Dog" })).not.toBeSelected()
  })

  it("writes the pressed option into the form and notifies the caller", async () => {
    const onValueChange = jest.fn()
    const { form } = await setup({ onValueChange })

    await fireEvent.press(screen.getByRole("radio", { name: "Dog" }))

    expect(form().getValues("species")).toBe("Dog")
    expect(onValueChange).toHaveBeenCalledWith("Dog")
  })

  it("does not react while disabled", async () => {
    const onValueChange = jest.fn()
    const { form } = await setup({ disabled: true, onValueChange })

    await fireEvent.press(screen.getByRole("radio", { name: "Dog" }))

    expect(form().getValues("species")).toBe("")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("shows the translated validation error", async () => {
    const { form } = await setup()

    await act(async () => {
      form().setError("species", { message: "validation.selectOption" })
    })

    expect(
      screen.getByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
  })
})
