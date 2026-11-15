import { act, waitFor } from "@testing-library/react-native"

import { uploadFile } from "@/lib/upload-file"
import { fillForm } from "@/test/fill-form"
import { apiClient, ok } from "@/test/mocks/api-client"
import { launchImageLibraryAsync } from "@/test/mocks/expo-image-picker"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useEditProfileForm } from "./use-edit-profile-form"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)
jest.mock("expo-image-picker", () =>
  jest.requireActual("@/test/mocks/expo-image-picker"),
)
jest.mock("@/lib/upload-file", () => ({
  PHOTO_CONTENT_TYPE: "image/jpeg",
  uploadFile: jest.fn(),
}))

const target = { url: "https://upload", fields: {}, objectKey: "avatars/a.jpg" }

async function setup() {
  apiClient.users.getProfile.mockResolvedValue(
    ok({
      profile: {
        firstName: "Ana",
        lastName: "Gomez",
        avatar: "https://img/a.jpg",
      },
    }),
  )
  apiClient.users.patchProfile.mockResolvedValue(ok({}))
  apiClient.users.prepareAvatarUpload.mockResolvedValue(ok(target))
  apiClient.users.confirmAvatarUpload.mockResolvedValue(ok({}))
  const onProfileSaved = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useEditProfileForm({ onProfileSaved }),
  )
  await waitFor(() => expect(hook.result.current.firstName).toBe("Ana"))

  return { ...hook, onProfileSaved }
}

describe("useEditProfileForm", () => {
  it("starts with the names and the photo of the account", async () => {
    const { result } = await setup()

    expect(result.current.firstName).toBe("Ana")
    expect(result.current.photoUri).toBe("https://img/a.jpg")
  })

  it("saves the edited names without uploading an unchanged photo", async () => {
    const { result, onProfileSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, { firstName: "Luisa" })
      await result.current.submit()
    })

    expect(apiClient.users.patchProfile).toHaveBeenCalledWith(
      "session-cookie",
      {
        firstName: "Luisa",
        lastName: "Gomez",
      },
    )
    expect(apiClient.users.prepareAvatarUpload).not.toHaveBeenCalled()
    expect(onProfileSaved).toHaveBeenCalledTimes(1)
  })

  it("does not save when a name is blank", async () => {
    const { result, onProfileSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, { firstName: "  " })
      await result.current.submit()
    })

    expect(apiClient.users.patchProfile).not.toHaveBeenCalled()
    expect(onProfileSaved).not.toHaveBeenCalled()
  })

  it("uploads a newly picked photo after saving the names", async () => {
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///new.jpg" }],
    })
    const { result, onProfileSaved } = await setup()

    await act(async () => {
      await result.current.photoPicker.chooseFromLibrary()
    })
    expect(result.current.photoUri).toBe("file:///new.jpg")

    await act(async () => {
      await result.current.submit()
    })

    expect(uploadFile).toHaveBeenCalledWith(target, "file:///new.jpg")
    expect(apiClient.users.confirmAvatarUpload).toHaveBeenCalledTimes(1)
    expect(onProfileSaved).toHaveBeenCalledTimes(1)
  })

  it("keeps the form open and warns when the photo upload fails", async () => {
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///new.jpg" }],
    })
    jest.mocked(uploadFile).mockRejectedValue(new Error("upload failed"))
    const { result, onProfileSaved } = await setup()

    await act(async () => {
      await result.current.photoPicker.chooseFromLibrary()
    })
    await act(async () => {
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("common.photoErrors.uploadFailed"),
    )
    expect(onProfileSaved).not.toHaveBeenCalled()
  })

  it("shows an error and does not close when saving the names fails", async () => {
    const { result, onProfileSaved } = await setup()
    apiClient.users.patchProfile.mockRejectedValue(new Error("boom"))

    await act(async () => {
      await fillForm(result.current.control, { firstName: "Luisa" })
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("account.profile.error"))
    expect(onProfileSaved).not.toHaveBeenCalled()
  })
})
