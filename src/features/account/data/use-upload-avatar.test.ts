import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { uploadFile } from "@/lib/upload-file"
import { apiClient, ok } from "@/test/mocks/api-client"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useUploadAvatar } from "./use-upload-avatar"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/lib/upload-file", () => ({
  PHOTO_CONTENT_TYPE: "image/jpeg",
  uploadFile: jest.fn(),
}))

const target = { url: "https://upload", fields: {}, objectKey: "avatars/a.jpg" }

describe("useUploadAvatar", () => {
  it("prepares, uploads and confirms the avatar in order", async () => {
    const calls: string[] = []
    apiClient.users.prepareAvatarUpload.mockImplementation(async () => {
      calls.push("prepare")
      return ok(target)
    })
    jest.mocked(uploadFile).mockImplementation(async () => {
      calls.push("upload")
    })
    apiClient.users.confirmAvatarUpload.mockImplementation(async () => {
      calls.push("confirm")
      return ok({})
    })
    const { result } = await renderHookWithProviders(() => useUploadAvatar())

    await act(async () => {
      await result.current.mutateAsync("file:///a.jpg")
    })

    expect(calls).toEqual(["prepare", "upload", "confirm"])
    expect(apiClient.users.prepareAvatarUpload).toHaveBeenCalledWith(
      "session-cookie",
      {
        contentType: "image/jpeg",
      },
    )
    expect(uploadFile).toHaveBeenCalledWith(target, "file:///a.jpg")
    expect(apiClient.users.confirmAvatarUpload).toHaveBeenCalledWith(
      "session-cookie",
      {
        objectKey: "avatars/a.jpg",
      },
    )
  })

  it("invalidates the account when done", async () => {
    apiClient.users.prepareAvatarUpload.mockResolvedValue(ok(target))
    apiClient.users.confirmAvatarUpload.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUploadAvatar(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync("file:///a.jpg")
    })

    expect(invalidated()).toEqual([queryKeys.account.all])
  })

  it("fails without uploading when there is no upload target", async () => {
    apiClient.users.prepareAvatarUpload.mockResolvedValue({ success: true })
    const { result } = await renderHookWithProviders(() => useUploadAvatar())

    await act(async () => {
      await expect(result.current.mutateAsync("file:///a.jpg")).rejects.toThrow(
        "Missing upload target",
      )
    })

    expect(uploadFile).not.toHaveBeenCalled()
    expect(apiClient.users.confirmAvatarUpload).not.toHaveBeenCalled()
  })

  it("does not confirm or invalidate when the upload fails", async () => {
    apiClient.users.prepareAvatarUpload.mockResolvedValue(ok(target))
    jest.mocked(uploadFile).mockRejectedValue(new Error("upload failed"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUploadAvatar(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(result.current.mutateAsync("file:///a.jpg")).rejects.toThrow(
        "upload failed",
      )
    })

    expect(apiClient.users.confirmAvatarUpload).not.toHaveBeenCalled()
    expect(invalidated()).toEqual([])
  })
})
