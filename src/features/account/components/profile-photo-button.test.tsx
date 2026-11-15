import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { ProfilePhotoButton } from "./profile-photo-button"

describe("ProfilePhotoButton", () => {
  it("is a button with its label and calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <ProfilePhotoButton name="Ana" label="Change photo" onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Change photo" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("shows the initial of the name without a photo", async () => {
    await renderWithProviders(
      <ProfilePhotoButton
        name="Ana"
        label="Change photo"
        onPress={jest.fn()}
      />,
    )

    expect(screen.getByText("A")).toBeOnTheScreen()
  })
})
