import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import type { CompanionTab } from "../utils/companion-tab"
import { CompanionAddMenu } from "./companion-add-menu"

const handlers = {
  onAddVaccine: jest.fn(),
  onAddAppointment: jest.fn(),
  onAddTreatment: jest.fn(),
}

async function openMenu(tab: CompanionTab) {
  await renderWithProviders(<CompanionAddMenu tab={tab} {...handlers} />)
  await fireEvent.press(
    screen.getByRole("button", { name: translate("addMenu.open") }),
  )
}

const action = (key: string) =>
  screen.queryByRole("button", { name: translate(key) })

describe("CompanionAddMenu", () => {
  it("offers vaccine, treatment and appointment on the overview", async () => {
    await openMenu("overview")

    expect(action("vaccine.add")).toBeOnTheScreen()
    expect(action("treatment.add")).toBeOnTheScreen()
    expect(action("appointment.add")).toBeOnTheScreen()
  })

  it("offers only vaccine and treatment on the health tab", async () => {
    await openMenu("health")

    expect(action("vaccine.add")).toBeOnTheScreen()
    expect(action("treatment.add")).toBeOnTheScreen()
    expect(action("appointment.add")).not.toBeOnTheScreen()
  })

  it("offers only the appointment on the appointments tab", async () => {
    await openMenu("appointments")

    expect(action("appointment.add")).toBeOnTheScreen()
    expect(action("vaccine.add")).not.toBeOnTheScreen()
    expect(action("treatment.add")).not.toBeOnTheScreen()
  })

  it.each([
    ["vaccine.add", "onAddVaccine"],
    ["treatment.add", "onAddTreatment"],
    ["appointment.add", "onAddAppointment"],
  ] as const)("runs %s through its handler", async (key, handler) => {
    await openMenu("overview")

    await fireEvent.press(screen.getByRole("button", { name: translate(key) }))

    expect(handlers[handler]).toHaveBeenCalledTimes(1)
  })
})
