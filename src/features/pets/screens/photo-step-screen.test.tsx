import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import {
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
} from "@/test/mocks/expo-image-picker"
import { toast } from "@/test/mocks/toast"
import { renderInCompanionForm } from "@/test/render-in-companion-form"
import { translate } from "@/test/translate"

import { PhotoStepScreen } from "./photo-step-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const finish = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("common.finish") }),
  )

describe("PhotoStepScreen", () => {
  it("asks for a photo as the last step", async () => {
    await renderInCompanionForm(
      <PhotoStepScreen onSaved={jest.fn()} />,
      makePet(),
    )

    expect(
      screen.getByRole("header", {
        name: translate("newCompanion.photo.title"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        translate("newCompanion.stepOf", { current: 9, total: 9 }),
      ),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("image", {
        name: translate("newCompanion.photo.previewLabel"),
      }),
    ).toBeOnTheScreen()
  })

  it("uses the save label when editing", async () => {
    await renderInCompanionForm(
      <PhotoStepScreen petId="pet-1" onSaved={jest.fn()} />,
      makePet(),
    )

    expect(
      screen.getByRole("button", { name: translate("editCompanion.submit") }),
    ).toBeOnTheScreen()
  })

  it("creates the companion without a photo and notifies the caller", async () => {
    apiClient.users.createPet.mockResolvedValue(ok(makePet({ id: "pet-new" })))
    const onSaved = jest.fn()
    await renderInCompanionForm(
      <PhotoStepScreen onSaved={onSaved} />,
      makePet(),
    )

    await finish()

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.users.createPet).toHaveBeenCalledTimes(1)
  })

  it("updates the companion when editing", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const onSaved = jest.fn()
    await renderInCompanionForm(
      <PhotoStepScreen petId="pet-1" onSaved={onSaved} />,
      makePet(),
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("editCompanion.submit") }),
    )

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.pets.update).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.anything(),
    )
  })

  it("picks a photo from the library and uploads it after creating", async () => {
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///luna.jpg" }],
    })
    apiClient.users.createPet.mockResolvedValue(ok(makePet({ id: "pet-new" })))
    apiClient.pets.preparePhotoUpload.mockResolvedValue(
      ok({ url: "https://upload", fields: {}, objectKey: "k" }),
    )
    apiClient.pets.confirmPhotoUpload.mockResolvedValue(ok({}))
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200, statusText: "OK" })
    await renderInCompanionForm(
      <PhotoStepScreen onSaved={jest.fn()} />,
      makePet(),
    )

    await act(async () => {
      await fireEvent.press(
        screen.getByRole("button", {
          name: translate("newCompanion.photo.chooseFromLibrary"),
        }),
      )
    })
    await finish()

    await waitFor(() =>
      expect(apiClient.pets.preparePhotoUpload).toHaveBeenCalledWith(
        "session-cookie",
        "pet-new",
        expect.anything(),
      ),
    )
  })

  it("shows an error and stays open when creating fails", async () => {
    apiClient.users.createPet.mockRejectedValue(new Error("boom"))
    const onSaved = jest.fn()
    await renderInCompanionForm(
      <PhotoStepScreen onSaved={onSaved} />,
      makePet(),
    )

    await finish()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("newCompanion.createError"),
      ),
    )
    expect(onSaved).not.toHaveBeenCalled()
  })

  it("warns when the camera permission is denied", async () => {
    requestCameraPermissionsAsync.mockResolvedValue({ granted: false })
    await renderInCompanionForm(
      <PhotoStepScreen onSaved={jest.fn()} />,
      makePet(),
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("newCompanion.photo.takePhoto"),
      }),
    )

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("common.photoErrors.cameraPermissionDenied"),
      ),
    )
  })
})
