import { fireEvent, screen } from "@testing-library/react-native"

import {
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { WeekSection } from "./week-section"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const today = () => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)

  return date
}

const inDays = (days: number) => {
  const date = today()
  date.setDate(date.getDate() + days)

  return date
}

const dose = (
  id: string,
  medication: string,
  occursAt: Date,
  petId = "pet-1",
) =>
  makeDoseItem({
    medicationName: medication,
    petName: "Luna",
    petId,
    occursAt,
    dose: { ...makeDoseItem().dose, id },
  })

describe("WeekSection", () => {
  it("shows the section label and the link to see everything", async () => {
    await renderWithProviders(
      <WeekSection items={[]} onOpenAll={jest.fn()} onOpenItem={jest.fn()} />,
    )

    expect(screen.getByText(translate("home.week.label"))).toBeOnTheScreen()
    expect(
      screen.getByRole("button", { name: translate("home.week.all") }),
    ).toBeOnTheScreen()
  })

  it("shows the empty state without items", async () => {
    await renderWithProviders(
      <WeekSection items={[]} onOpenAll={jest.fn()} onOpenItem={jest.fn()} />,
    )

    expect(
      screen.getByText(translate("home.week.emptyTitle")),
    ).toBeOnTheScreen()
  })

  it("opens everything from the link", async () => {
    const onOpenAll = jest.fn()
    await renderWithProviders(
      <WeekSection items={[]} onOpenAll={onOpenAll} onOpenItem={jest.fn()} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("home.week.all") }),
    )

    expect(onOpenAll).toHaveBeenCalledTimes(1)
  })

  it("groups the items by day with relative headings", async () => {
    await renderWithProviders(
      <WeekSection
        items={[
          dose("a", "Morning pill", today()),
          dose("b", "Tomorrow pill", inDays(1)),
        ]}
        onOpenAll={jest.fn()}
        onOpenItem={jest.fn()}
      />,
    )

    expect(
      screen.getByText(translate("common.relativeDays.today")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("common.relativeDays.tomorrow")),
    ).toBeOnTheScreen()
    expect(
      screen.queryByText(translate("home.week.emptyTitle")),
    ).not.toBeOnTheScreen()
  })

  it("opens the pet of the pressed item", async () => {
    const onOpenItem = jest.fn()
    await renderWithProviders(
      <WeekSection
        items={[dose("a", "Pill", today(), "pet-7")]}
        onOpenAll={jest.fn()}
        onOpenItem={onOpenItem}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: /Pill · Luna/ }))

    expect(onOpenItem).toHaveBeenCalledWith("pet-7")
  })

  it("shows at most five items and counts the rest", async () => {
    const items = Array.from({ length: 8 }, (_, index) =>
      makeBirthdayItem({
        petId: `pet-${index}`,
        petName: `Pet${index}`,
        occursAt: inDays(1),
      }),
    )
    await renderWithProviders(
      <WeekSection
        items={items}
        onOpenAll={jest.fn()}
        onOpenItem={jest.fn()}
      />,
    )

    expect(
      screen.getByText(translate("home.week.more", { count: 3 })),
    ).toBeOnTheScreen()
    expect(screen.getAllByRole("button", { name: /Pet\d/ })).toHaveLength(5)
  })

  it("opens everything from the more link", async () => {
    const onOpenAll = jest.fn()
    const items = Array.from({ length: 6 }, (_, index) =>
      makeBirthdayItem({ petId: `pet-${index}`, occursAt: inDays(1) }),
    )
    await renderWithProviders(
      <WeekSection
        items={items}
        onOpenAll={onOpenAll}
        onOpenItem={jest.fn()}
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("home.week.more", { count: 1 }),
      }),
    )

    expect(onOpenAll).toHaveBeenCalledTimes(1)
  })

  it("does not show the more link with five items or fewer", async () => {
    const items = Array.from({ length: 5 }, (_, index) =>
      makeBirthdayItem({ petId: `pet-${index}`, occursAt: inDays(1) }),
    )
    await renderWithProviders(
      <WeekSection
        items={items}
        onOpenAll={jest.fn()}
        onOpenItem={jest.fn()}
      />,
    )

    expect(screen.queryByText(/más/)).not.toBeOnTheScreen()
  })
})
