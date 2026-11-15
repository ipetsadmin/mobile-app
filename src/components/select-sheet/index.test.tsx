import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SelectSheet } from "./index"

const options = [
  { value: "pastor", label: "Pastor Alemán" },
  { value: "poodle", label: "Poodle" },
  { value: "lab", label: "Labrador" },
]

const props = {
  isOpen: true,
  title: "Breed",
  options,
  emptyText: "No results",
  onSelect: jest.fn(),
  onClose: jest.fn(),
}

describe("SelectSheet", () => {
  it("shows nothing while closed", async () => {
    await renderWithProviders(<SelectSheet {...props} isOpen={false} />)

    expect(screen.queryByText("Breed")).not.toBeOnTheScreen()
    expect(screen.queryByRole("radio")).not.toBeOnTheScreen()
  })

  it("shows the title and every option when open", async () => {
    await renderWithProviders(<SelectSheet {...props} />)

    expect(screen.getByRole("header", { name: "Breed" })).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("marks the selected value", async () => {
    await renderWithProviders(<SelectSheet {...props} selectedValue="lab" />)

    expect(screen.getByRole("radio", { name: "Labrador" })).toBeSelected()
  })

  it("reports the chosen value", async () => {
    const onSelect = jest.fn()
    await renderWithProviders(<SelectSheet {...props} onSelect={onSelect} />)

    await fireEvent.press(screen.getByRole("radio", { name: "Poodle" }))

    expect(onSelect).toHaveBeenCalledWith("poodle")
  })

  it("closes when dismissed", async () => {
    const onClose = jest.fn()
    await renderWithProviders(<SelectSheet {...props} onClose={onClose} />)

    await fireEvent.press(screen.getByLabelText("dismiss-sheet"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("has no search box without a placeholder", async () => {
    await renderWithProviders(<SelectSheet {...props} />)

    expect(screen.queryByLabelText("Search")).not.toBeOnTheScreen()
  })

  it("filters the options ignoring accents and case", async () => {
    await renderWithProviders(
      <SelectSheet {...props} searchPlaceholder="Search" />,
    )

    await fireEvent.changeText(screen.getByLabelText("Search"), "aleman")

    expect(screen.getAllByRole("radio")).toHaveLength(1)
    expect(
      screen.getByRole("radio", { name: "Pastor Alemán" }),
    ).toBeOnTheScreen()
  })

  it("shows the empty text when nothing matches", async () => {
    await renderWithProviders(
      <SelectSheet {...props} searchPlaceholder="Search" />,
    )

    await fireEvent.changeText(screen.getByLabelText("Search"), "zzz")

    expect(screen.getByText("No results")).toBeOnTheScreen()
  })

  it("shows every option again when the search is cleared", async () => {
    await renderWithProviders(
      <SelectSheet {...props} searchPlaceholder="Search" />,
    )

    await fireEvent.changeText(screen.getByLabelText("Search"), "pool")
    await fireEvent.changeText(screen.getByLabelText("Search"), "")

    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })
})
