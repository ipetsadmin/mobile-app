import { act, fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import { SelectField } from "./select-field"

const options = [
  { value: "lab", label: "Labrador" },
  { value: "poodle", label: "Poodle" },
]

async function setup(breed = "") {
  return renderWithForm({ breed }, (control) => (
    <SelectField
      control={control}
      name="breed"
      label="Breed"
      placeholder="Choose a breed"
      sheetTitle="Breeds"
      emptyText="No results"
      options={options}
    />
  ))
}

describe("SelectField", () => {
  it("shows the placeholder while nothing is selected", async () => {
    await setup()

    expect(screen.getByText("Choose a breed")).toBeOnTheScreen()
  })

  it("shows the label of the selected option", async () => {
    await setup("poodle")

    expect(screen.getByText("Poodle")).toBeOnTheScreen()
    expect(screen.queryByText("Choose a breed")).not.toBeOnTheScreen()
  })

  it("opens the sheet when pressed", async () => {
    await setup()

    expect(screen.queryByTestId("bottom-sheet")).not.toBeOnTheScreen()

    await fireEvent.press(screen.getByRole("button", { name: "Breed" }))

    expect(screen.getByTestId("bottom-sheet")).toBeOnTheScreen()
  })

  it("writes the chosen option into the form and closes the sheet", async () => {
    const { form } = await setup()

    await fireEvent.press(screen.getByRole("button", { name: "Breed" }))
    await fireEvent.press(screen.getByRole("radio", { name: "Labrador" }))

    expect(form().getValues("breed")).toBe("lab")
    expect(screen.queryByTestId("bottom-sheet")).not.toBeOnTheScreen()
    expect(screen.getByText("Labrador")).toBeOnTheScreen()
  })

  it("closes the sheet without changing the value when dismissed", async () => {
    const { form } = await setup()

    await fireEvent.press(screen.getByRole("button", { name: "Breed" }))
    await fireEvent.press(screen.getByLabelText("dismiss-sheet"))

    expect(form().getValues("breed")).toBe("")
    expect(screen.queryByTestId("bottom-sheet")).not.toBeOnTheScreen()
  })

  it("shows the translated validation error", async () => {
    const { form } = await setup()

    await act(async () => {
      form().setError("breed", { message: "validation.selectOption" })
    })

    expect(
      screen.getByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
  })
})
