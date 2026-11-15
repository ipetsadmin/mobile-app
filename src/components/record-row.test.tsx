import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { RecordRow } from "./record-row"

describe("RecordRow", () => {
  it("shows only the title by default", async () => {
    await renderWithProviders(<RecordRow title="Rabies" />)

    expect(screen.getByText("Rabies")).toBeOnTheScreen()
  })

  it("shows the subtitle and the caption when given", async () => {
    await renderWithProviders(
      <RecordRow title="Rabies" subtitle="Zoetis" caption="Jun 10, 2026" />,
    )

    expect(screen.getByText("Zoetis")).toBeOnTheScreen()
    expect(screen.getByText("Jun 10, 2026")).toBeOnTheScreen()
  })

  it("omits the subtitle and the caption when missing", async () => {
    await renderWithProviders(<RecordRow title="Rabies" />)

    expect(screen.queryByText("Zoetis")).not.toBeOnTheScreen()
  })
})
