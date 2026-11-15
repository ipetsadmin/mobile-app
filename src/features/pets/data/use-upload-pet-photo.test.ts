import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { uploadFile } from "@/lib/upload-file"
import { apiClient, ok } from "@/test/mocks/api-client"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useUploadPetPhoto } from "./use-upload-pet-photo"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/lib/upload-file", () => ({
  PHOTO_CONTENT_TYPE: "image/jpeg",
  uploadFile: jest.fn(),
}))

const target = {
  url: "https://upload",
  fields: {},
  objectKey: "pets/photo.jpg",
}

describe("useUploadPetPhoto", () => {
  it("prepares, uploads and confirms the photo in order", async () => {
    const calls: string[] = []
    apiClient.pets.preparePhotoUpload.mockImplementation(async () => {
      calls.push("prepare")
      return ok(target)
    })
    jest.mocked(uploadFile).mockImplementation(async () => {
      calls.push("upload")
    })
    apiClient.pets.confirmPhotoUpload.mockImplementation(async () => {
      calls.push("confirm")
      return ok({})
    })
    const { result } = await renderHookWithProviders(() => useUploadPetPhoto())

    await act(async () => {
      await result.current.mutateAsync({ petId: "pet-1", uri: "file:///a.jpg" })
    })

    expect(calls).toEqual(["prepare", "upload", "confirm"])
    expect(apiClient.pets.preparePhotoUpload).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      { contentType: "image/jpeg" },
    )
    expect(uploadFile).toHaveBeenCalledWith(target, "file:///a.jpg")
    expect(apiClient.pets.confirmPhotoUpload).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      { objectKey: "pets/photo.jpg" },
    )
  })

  it("invalidates the pets and the agenda when done", async () => {
    apiClient.pets.preparePhotoUpload.mockResolvedValue(ok(target))
    apiClient.pets.confirmPhotoUpload.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUploadPetPhoto(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync({ petId: "pet-1", uri: "file:///a.jpg" })
    })

    expect(invalidated()).toEqual([queryKeys.pets.all, queryKeys.agenda.all])
  })

  it("fails without uploading when there is no upload target", async () => {
    apiClient.pets.preparePhotoUpload.mockResolvedValue({ success: true })
    const { result } = await renderHookWithProviders(() => useUploadPetPhoto())

    await act(async () => {
      await expect(
        result.current.mutateAsync({ petId: "pet-1", uri: "file:///a.jpg" }),
      ).rejects.toThrow("Missing upload target")
    })

    expect(uploadFile).not.toHaveBeenCalled()
    expect(apiClient.pets.confirmPhotoUpload).not.toHaveBeenCalled()
  })

  it("does not confirm or invalidate when the upload fails", async () => {
    apiClient.pets.preparePhotoUpload.mockResolvedValue(ok(target))
    jest.mocked(uploadFile).mockRejectedValue(new Error("upload failed"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUploadPetPhoto(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(
        result.current.mutateAsync({ petId: "pet-1", uri: "file:///a.jpg" }),
      ).rejects.toThrow("upload failed")
    })

    expect(apiClient.pets.confirmPhotoUpload).not.toHaveBeenCalled()
    expect(invalidated()).toEqual([])
  })
})
