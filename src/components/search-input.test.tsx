import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SearchInput } from "./search-input"

describe("SearchInput", () => {
  it("shows the value and uses the placeholder as its label", async () => {
    await renderWithProviders(
      <SearchInput
        value="lab"
        placeholder="Search breeds"
        onChangeText={jest.fn()}
      />,
    )

    const input = screen.getByLabelText("Search breeds")

    expect(input).toHaveDisplayValue("lab")
  })

  it("reports what the user types", async () => {
    const onChangeText = jest.fn()
    await renderWithProviders(
      <SearchInput
        value=""
        placeholder="Search breeds"
        onChangeText={onChangeText}
      />,
    )

    await fireEvent.changeText(screen.getByLabelText("Search breeds"), "pug")

    expect(onChangeText).toHaveBeenCalledWith("pug")
  })

  it("keeps working after gaining and losing focus", async () => {
    await renderWithProviders(
      <SearchInput
        value=""
        placeholder="Search breeds"
        onChangeText={jest.fn()}
      />,
    )
    const input = screen.getByLabelText("Search breeds")

    await fireEvent(input, "focus")
    await fireEvent(input, "blur")

    expect(input).toBeOnTheScreen()
  })
})
