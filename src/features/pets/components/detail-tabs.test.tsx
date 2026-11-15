import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { DetailTabs } from "./detail-tabs"

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "health", label: "Health" },
  { value: "appointments", label: "Appointments" },
]

const progress = { value: 0 } as never

describe("DetailTabs", () => {
  it("lists every tab", async () => {
    await renderWithProviders(
      <DetailTabs
        tabs={tabs}
        value="overview"
        progress={progress}
        onChange={jest.fn()}
      />,
    )

    expect(screen.getAllByRole("tab")).toHaveLength(3)
  })

  it("marks only the current tab as selected", async () => {
    await renderWithProviders(
      <DetailTabs
        tabs={tabs}
        value="health"
        progress={progress}
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByRole("tab", { name: "Health" })).toBeSelected()
    expect(screen.getByRole("tab", { name: "Overview" })).not.toBeSelected()
  })

  it("reports the value of the pressed tab", async () => {
    const onChange = jest.fn()
    await renderWithProviders(
      <DetailTabs
        tabs={tabs}
        value="overview"
        progress={progress}
        onChange={onChange}
      />,
    )

    await fireEvent.press(screen.getByRole("tab", { name: "Appointments" }))

    expect(onChange).toHaveBeenCalledWith("appointments")
  })
})
