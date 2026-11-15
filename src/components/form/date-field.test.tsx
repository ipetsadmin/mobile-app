import { act, fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import { DateField } from "./date-field"

async function setup(
  birthDate: Date | undefined,
  props: {
    preserveTime?: boolean
    disabled?: boolean
    onValueChange?: (date: Date) => void
  } = {},
) {
  return renderWithForm({ birthDate }, (control) => (
    <DateField
      control={control}
      name="birthDate"
      label="Birth date"
      placeholder="Pick a date"
      {...props}
    />
  ))
}

describe("DateField", () => {
  it("shows the placeholder without a value", async () => {
    await setup(undefined)

    expect(screen.getByText("Pick a date")).toBeOnTheScreen()
  })

  it("shows the long date of the current value", async () => {
    await setup(new Date(2026, 5, 15))

    expect(screen.getByText("15 de junio de 2026")).toBeOnTheScreen()
  })

  it("writes the pressed day into the form", async () => {
    const onValueChange = jest.fn()
    const { form } = await setup(new Date(2026, 5, 15), { onValueChange })

    await fireEvent.press(
      screen.getByRole("button", { name: "20 de junio de 2026" }),
    )

    expect(form().getValues("birthDate")).toEqual(new Date(2026, 5, 20))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 20))
  })

  it("replaces the time when the day is picked by default", async () => {
    const { form } = await setup(new Date(2026, 5, 15, 14, 30))

    await fireEvent.press(
      screen.getByRole("button", { name: "20 de junio de 2026" }),
    )

    expect(form().getValues("birthDate")).toEqual(new Date(2026, 5, 20))
  })

  it("keeps the time of the previous value when asked", async () => {
    const { form } = await setup(new Date(2026, 5, 15, 14, 30), {
      preserveTime: true,
    })

    await fireEvent.press(
      screen.getByRole("button", { name: "20 de junio de 2026" }),
    )

    expect(form().getValues("birthDate")).toEqual(new Date(2026, 5, 20, 14, 30))
  })

  it("shows the translated validation error", async () => {
    const { form } = await setup(new Date(2026, 5, 15))

    await act(async () => {
      form().setError("birthDate", { message: "validation.notFuture" })
    })

    expect(
      screen.getByText(translate("validation.notFuture")),
    ).toBeOnTheScreen()
  })
})
