import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { Note } from "./note"

describe("Note", () => {
  it("shows its text", async () => {
    await renderWithProviders(<Note text="You can change this later" />)

    expect(screen.getByText("You can change this later")).toBeOnTheScreen()
  })
})
