import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { PetPhotoPreview } from "./pet-photo-preview"

describe("PetPhotoPreview", () => {
  it("is announced as an image with its label", async () => {
    await renderWithProviders(
      <PetPhotoPreview accessibilityLabel="Photo of Luna" />,
    )

    expect(
      screen.getByRole("image", { name: "Photo of Luna" }),
    ).toBeOnTheScreen()
  })

  it("keeps the same label when there is a photo", async () => {
    await renderWithProviders(
      <PetPhotoPreview
        uri="file:///luna.jpg"
        accessibilityLabel="Photo of Luna"
      />,
    )

    expect(
      screen.getByRole("image", { name: "Photo of Luna" }),
    ).toBeOnTheScreen()
  })
})
