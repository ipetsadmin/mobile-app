import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"

import { CodeField } from "./code-field"

async function setup(length?: number, code = "") {
  return renderWithForm({ code }, (control) => (
    <CodeField control={control} name="code" label="Code" length={length} />
  ))
}

describe("CodeField", () => {
  it("shows the current digits, one per cell", async () => {
    await setup(6, "123")

    expect(screen.getByText("1")).toBeOnTheScreen()
    expect(screen.getByText("2")).toBeOnTheScreen()
    expect(screen.getByText("3")).toBeOnTheScreen()
  })

  it("keeps only digits", async () => {
    const { form } = await setup()

    await fireEvent.changeText(screen.getByLabelText("Code"), "1a2-3")

    expect(form().getValues("code")).toBe("123")
  })

  it("cuts the code to the expected length", async () => {
    const { form } = await setup(4)

    await fireEvent.changeText(screen.getByLabelText("Code"), "123456")

    expect(form().getValues("code")).toBe("1234")
  })

  it("limits the input to the expected length", async () => {
    await setup(4)

    expect(screen.getByLabelText("Code").props.maxLength).toBe(4)
  })

  it("asks the keyboard for a one-time code", async () => {
    await setup()

    expect(screen.getByLabelText("Code").props.textContentType).toBe(
      "oneTimeCode",
    )
  })

  it("marks the field as touched on blur", async () => {
    const { form } = await setup()
    const input = screen.getByLabelText("Code")

    await fireEvent(input, "focus")
    await fireEvent(input, "blur")

    expect(form().getFieldState("code").isTouched).toBe(true)
  })
})
