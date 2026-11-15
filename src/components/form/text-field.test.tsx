import { act, fireEvent, screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import { TextField } from "./text-field"

const defaults = { name: "" }

describe("TextField", () => {
  it("shows the label and the current value", async () => {
    await renderWithForm({ name: "Luna" }, (control) => (
      <TextField control={control} name="name" label="Name" />
    ))

    expect(screen.getByText("Name ·")).toBeOnTheScreen()
    expect(screen.getByLabelText("Name")).toHaveDisplayValue("Luna")
  })

  it("writes what the user types into the form", async () => {
    const { form } = await renderWithForm(defaults, (control) => (
      <TextField control={control} name="name" label="Name" />
    ))

    await fireEvent.changeText(screen.getByLabelText("Name"), "Rocky")

    expect(form().getValues("name")).toBe("Rocky")
  })

  it("shows the translated validation error of the field", async () => {
    const { form } = await renderWithForm(defaults, (control) => (
      <TextField control={control} name="name" label="Name" />
    ))

    await act(async () => {
      form().setError("name", { message: "validation.required" })
    })

    expect(screen.getByText(translate("validation.required"))).toBeOnTheScreen()
  })

  it("marks the field as touched on blur and calls the extra handlers", async () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const { form } = await renderWithForm(defaults, (control) => (
      <TextField
        control={control}
        name="name"
        label="Name"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    ))
    const input = screen.getByLabelText("Name")

    await fireEvent(input, "focus")
    await fireEvent(input, "blur")

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(form().getFieldState("name").isTouched).toBe(true)
  })

  it("passes the remaining props to the input", async () => {
    await renderWithForm(defaults, (control) => (
      <TextField
        control={control}
        name="name"
        label="Name"
        placeholder="Pet name"
        maxLength={20}
      />
    ))

    expect(screen.getByPlaceholderText("Pet name")).toBeOnTheScreen()
  })

  it("renders the hint, the trailing content and the accessory", async () => {
    await renderWithForm(defaults, (control) => (
      <TextField
        control={control}
        name="name"
        label="Name"
        hint="Required"
        trailing={<Text>trailing</Text>}
        accessory={<Text>accessory</Text>}
      />
    ))

    expect(screen.getByText("Required")).toBeOnTheScreen()
    expect(screen.getByText("trailing")).toBeOnTheScreen()
    expect(screen.getByText("accessory")).toBeOnTheScreen()
  })
})
