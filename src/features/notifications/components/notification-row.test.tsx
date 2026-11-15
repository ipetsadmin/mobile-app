import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { NotificationRow } from "./notification-row"

const notification = {
  id: "dose-1",
  title: "Amoxicillin · Luna",
  detail: "10:00",
  timeLabel: "Mañana",
  isUrgent: false,
}

describe("NotificationRow", () => {
  it("shows the title, the detail and the time label", async () => {
    await renderWithProviders(<NotificationRow notification={notification} />)

    expect(screen.getByText("Amoxicillin · Luna")).toBeOnTheScreen()
    expect(screen.getByText("10:00")).toBeOnTheScreen()
    expect(screen.getByText("Mañana")).toBeOnTheScreen()
  })

  it("renders an urgent notification", async () => {
    await renderWithProviders(
      <NotificationRow notification={{ ...notification, isUrgent: true }} />,
    )

    expect(screen.getByText("Amoxicillin · Luna")).toBeOnTheScreen()
  })
})
