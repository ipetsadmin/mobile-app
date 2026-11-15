import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { Alert, type AlertButton } from "react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { launchImageLibraryAsync } from "@/test/mocks/expo-image-picker"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { EditProfileScreen } from "./edit-profile-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

beforeEach(() => {
  apiClient.users.getProfile.mockResolvedValue(
    ok({ profile: { firstName: "Ana", lastName: "Gomez", avatar: null } }),
  )
  apiClient.users.patchProfile.mockResolvedValue(ok({}))
})

const firstName = () =>
  screen.getByLabelText(translate("account.profile.firstName"))
const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("account.profile.submit") }),
  )

describe("EditProfileScreen", () => {
  it("starts with the names of the account", async () => {
    await renderWithProviders(<EditProfileScreen onProfileSaved={jest.fn()} />)

    await waitFor(() => expect(firstName()).toHaveDisplayValue("Ana"))
    expect(
      screen.getByLabelText(translate("account.profile.lastName")),
    ).toHaveDisplayValue("Gomez")
  })

  it("saves the edited name and notifies the caller", async () => {
    const onProfileSaved = jest.fn()
    await renderWithProviders(
      <EditProfileScreen onProfileSaved={onProfileSaved} />,
    )
    await waitFor(() => expect(firstName()).toHaveDisplayValue("Ana"))

    await fireEvent.changeText(firstName(), "Luisa")
    await submit()

    await waitFor(() => expect(onProfileSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.users.patchProfile).toHaveBeenCalledWith(
      "session-cookie",
      {
        firstName: "Luisa",
        lastName: "Gomez",
      },
    )
  })

  it("does not save a blank name", async () => {
    const onProfileSaved = jest.fn()
    await renderWithProviders(
      <EditProfileScreen onProfileSaved={onProfileSaved} />,
    )
    await waitFor(() => expect(firstName()).toHaveDisplayValue("Ana"))

    await fireEvent.changeText(firstName(), "  ")
    await submit()

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(apiClient.users.patchProfile).not.toHaveBeenCalled()
  })

  it("shows an error when saving fails", async () => {
    apiClient.users.patchProfile.mockRejectedValue(new Error("boom"))
    const onProfileSaved = jest.fn()
    await renderWithProviders(
      <EditProfileScreen onProfileSaved={onProfileSaved} />,
    )
    await waitFor(() => expect(firstName()).toHaveDisplayValue("Ana"))

    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("account.profile.error"),
      ),
    )
    expect(onProfileSaved).not.toHaveBeenCalled()
  })

  it("offers to take a photo or choose one from the library", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {})
    await renderWithProviders(<EditProfileScreen onProfileSaved={jest.fn()} />)

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("account.profile.photoOptions"),
      }),
    )

    const buttons = alert.mock.calls[0][2] as AlertButton[]
    expect(buttons.map((button) => button.text)).toEqual([
      translate("account.profile.takePhoto"),
      translate("account.profile.chooseFromLibrary"),
      translate("common.cancel"),
    ])
  })

  it("picks a photo from the library", async () => {
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///new.jpg" }],
    })
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {})
    await renderWithProviders(<EditProfileScreen onProfileSaved={jest.fn()} />)

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("account.profile.photoOptions"),
      }),
    )
    const buttons = alert.mock.calls[0][2] as AlertButton[]
    await act(async () => {
      await buttons[1].onPress?.()
    })

    expect(launchImageLibraryAsync).toHaveBeenCalledTimes(1)
  })
})
