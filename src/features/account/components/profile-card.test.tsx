import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { ProfileCard } from "./profile-card"

describe("ProfileCard", () => {
  it("shows the name, the email and the initial", async () => {
    await renderWithProviders(
      <ProfileCard
        name="Ana Gomez"
        email="ana@example.com"
        onPress={jest.fn()}
      />,
    )

    expect(screen.getByText("Ana Gomez")).toBeOnTheScreen()
    expect(screen.getByText("ana@example.com")).toBeOnTheScreen()
    expect(screen.getByText("A")).toBeOnTheScreen()
  })

  it("is a button labelled with the name and calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <ProfileCard
        name="Ana Gomez"
        email="ana@example.com"
        onPress={onPress}
      />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Ana Gomez" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("shows the photo instead of the initial when there is one", async () => {
    await renderWithProviders(
      <ProfileCard
        name="Ana Gomez"
        email="ana@example.com"
        photoUri="https://img/a.jpg"
        onPress={jest.fn()}
      />,
    )

    expect(screen.queryByText("A")).not.toBeOnTheScreen()
  })
})
