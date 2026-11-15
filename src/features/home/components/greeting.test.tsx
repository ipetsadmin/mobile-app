import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { Greeting } from "./greeting"

afterEach(() => {
  jest.useRealTimers()
})

const at = (hour: number) => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 5, 15, hour))
}

describe("Greeting", () => {
  it.each([
    [9, "morning"],
    [15, "afternoon"],
    [21, "evening"],
  ] as const)("greets with the %i o'clock period", async (hour, period) => {
    at(hour)
    await renderWithProviders(<Greeting name="Ana Gomez" companionCount={1} />)

    expect(
      screen.getByRole("header", {
        name: translate(`home.greeting.${period}`, { name: "Ana" }),
      }),
    ).toBeOnTheScreen()
  })

  it("uses only the first name", async () => {
    at(9)
    await renderWithProviders(
      <Greeting name="  Ana María Gomez " companionCount={1} />,
    )

    expect(
      screen.getByRole("header", {
        name: translate("home.greeting.morning", { name: "Ana" }),
      }),
    ).toBeOnTheScreen()
  })

  it("shows today's date label", async () => {
    at(9)
    await renderWithProviders(<Greeting name="Ana" companionCount={1} />)

    expect(screen.getByText("lunes · 15 jun")).toBeOnTheScreen()
  })

  it("counts the companions", async () => {
    at(9)
    await renderWithProviders(<Greeting name="Ana" companionCount={3} />)

    expect(
      screen.getByText(translate("home.companions", { count: 3 })),
    ).toBeOnTheScreen()
  })

  it("uses the singular for one companion", async () => {
    at(9)
    await renderWithProviders(<Greeting name="Ana" companionCount={1} />)

    expect(
      screen.getByText(translate("home.companions", { count: 1 })),
    ).toBeOnTheScreen()
  })

  it("invites to add a companion when there are none", async () => {
    at(9)
    await renderWithProviders(<Greeting name="Ana" companionCount={0} />)

    expect(screen.getByText(translate("home.noCompanions"))).toBeOnTheScreen()
  })
})
