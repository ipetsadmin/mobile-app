import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { getTimeSlots } from "@/utils/time-slots"

import { TimeField } from "./time-field"

const slotLabel = (value: string) =>
  getTimeSlots("es").find((slot) => slot.value === value)?.label ?? value

async function setup(scheduledAt?: Date) {
  return renderWithForm({ scheduledAt }, (control) => (
    <TimeField
      control={control}
      name="scheduledAt"
      label="Time"
      placeholder="Choose a time"
      sheetTitle="Times"
      emptyText="No times"
    />
  ))
}

describe("TimeField", () => {
  it("shows the placeholder without a value", async () => {
    await setup()

    expect(screen.getByText("Choose a time")).toBeOnTheScreen()
  })

  it("shows the time slot of the current value", async () => {
    await setup(new Date(2026, 5, 15, 14, 30))

    expect(screen.getByText(slotLabel("14:30"))).toBeOnTheScreen()
  })

  it("offers the half-hour slots starting at midnight when opened", async () => {
    await setup()

    await fireEvent.press(screen.getByRole("button", { name: "Time" }))

    expect(
      screen.getByRole("radio", { name: slotLabel("00:00") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("radio", { name: slotLabel("00:30") }),
    ).toBeOnTheScreen()
  })

  it("marks the slot of the current value as selected", async () => {
    await setup(new Date(2026, 5, 15, 2, 30))

    await fireEvent.press(screen.getByRole("button", { name: "Time" }))

    expect(
      screen.getByRole("radio", { name: slotLabel("02:30") }),
    ).toBeSelected()
  })

  it("keeps the day and changes only the time of the chosen slot", async () => {
    const { form } = await setup(new Date(2026, 5, 15, 8, 0))

    await fireEvent.press(screen.getByRole("button", { name: "Time" }))
    await fireEvent.press(
      screen.getByRole("radio", { name: slotLabel("04:30") }),
    )

    expect(form().getValues("scheduledAt")).toEqual(
      new Date(2026, 5, 15, 4, 30),
    )
    expect(screen.queryByTestId("bottom-sheet")).not.toBeOnTheScreen()
  })

  it("uses today when there was no date yet", async () => {
    const { form } = await setup()

    await fireEvent.press(screen.getByRole("button", { name: "Time" }))
    await fireEvent.press(
      screen.getByRole("radio", { name: slotLabel("03:00") }),
    )

    const chosen = form().getValues("scheduledAt") as Date
    const today = new Date()

    expect(chosen.getHours()).toBe(3)
    expect(chosen.getDate()).toBe(today.getDate())
  })
})
