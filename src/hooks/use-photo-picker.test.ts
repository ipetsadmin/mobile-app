import { act } from "@testing-library/react-native"

import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
} from "@/test/mocks/expo-image-picker"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { usePhotoPicker } from "./use-photo-picker"

const picked = { canceled: false, assets: [{ uri: "file:///photo.jpg" }] }

async function setup() {
  const onPhotoPicked = jest.fn()
  const hook = await renderHookWithProviders(() =>
    usePhotoPicker({ onPhotoPicked }),
  )

  return { ...hook, onPhotoPicked }
}

describe("takePhoto", () => {
  it("opens the camera and returns the picked photo", async () => {
    requestCameraPermissionsAsync.mockResolvedValue({ granted: true })
    launchCameraAsync.mockResolvedValue(picked)
    const { result, onPhotoPicked } = await setup()

    await act(async () => {
      await result.current.takePhoto()
    })

    expect(launchCameraAsync).toHaveBeenCalledWith(
      expect.objectContaining({ allowsEditing: true, aspect: [1, 1] }),
    )
    expect(onPhotoPicked).toHaveBeenCalledWith("file:///photo.jpg")
  })

  it("does not open the camera without permission", async () => {
    requestCameraPermissionsAsync.mockResolvedValue({ granted: false })
    const { result, onPhotoPicked } = await setup()

    await act(async () => {
      await result.current.takePhoto()
    })

    expect(launchCameraAsync).not.toHaveBeenCalled()
    expect(onPhotoPicked).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      translate("common.photoErrors.cameraPermissionDenied"),
    )
  })

  it("ignores a cancelled capture", async () => {
    requestCameraPermissionsAsync.mockResolvedValue({ granted: true })
    launchCameraAsync.mockResolvedValue({ canceled: true, assets: null })
    const { result, onPhotoPicked } = await setup()

    await act(async () => {
      await result.current.takePhoto()
    })

    expect(onPhotoPicked).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("warns when the camera is unavailable", async () => {
    requestCameraPermissionsAsync.mockResolvedValue({ granted: true })
    launchCameraAsync.mockRejectedValue(new Error("no camera"))
    const { result } = await setup()

    await act(async () => {
      await result.current.takePhoto()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("common.photoErrors.cameraUnavailable"),
    )
  })
})

describe("chooseFromLibrary", () => {
  it("returns the chosen photo", async () => {
    launchImageLibraryAsync.mockResolvedValue(picked)
    const { result, onPhotoPicked } = await setup()

    await act(async () => {
      await result.current.chooseFromLibrary()
    })

    expect(onPhotoPicked).toHaveBeenCalledWith("file:///photo.jpg")
  })

  it("ignores a cancelled selection", async () => {
    launchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null })
    const { result, onPhotoPicked } = await setup()

    await act(async () => {
      await result.current.chooseFromLibrary()
    })

    expect(onPhotoPicked).not.toHaveBeenCalled()
  })

  it("warns when the library is unavailable", async () => {
    launchImageLibraryAsync.mockRejectedValue(new Error("no library"))
    const { result } = await setup()

    await act(async () => {
      await result.current.chooseFromLibrary()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("common.photoErrors.libraryUnavailable"),
    )
  })
})
