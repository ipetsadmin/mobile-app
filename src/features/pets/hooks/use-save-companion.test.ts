import { act } from "@testing-library/react-native"
import { useFormContext } from "react-hook-form"

import { uploadFile } from "@/lib/upload-file"
import { createCompanionFormWrapper } from "@/test/companion-form-wrapper"
import { makeCompanionValues } from "@/test/factories/make-companion-values"
import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { toCreatePetBody } from "../data/to-create-pet-body"
import { toPetDetailsBody } from "../data/to-pet-details-body"
import type { CompanionValues } from "../schema/companion.schema"
import { useSaveCompanion } from "./use-save-companion"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)
jest.mock("@/lib/upload-file", () => ({
  PHOTO_CONTENT_TYPE: "image/jpeg",
  uploadFile: jest.fn(),
}))
jest.mock("sonner-native", () => jest.requireActual("@/test/mocks/toast"))

const target = { url: "https://upload", fields: {}, objectKey: "pets/a.jpg" }

async function setup(petId?: string, values: Partial<CompanionValues> = {}) {
  apiClient.pets.preparePhotoUpload.mockResolvedValue(ok(target))
  apiClient.pets.confirmPhotoUpload.mockResolvedValue(ok({}))
  const onSaved = jest.fn()
  const hook = await renderHookWithProviders(
    () => ({
      save: useSaveCompanion({ petId, onSaved }),
      form: useFormContext<CompanionValues>(),
    }),
    createTestQueryClient(),
    createCompanionFormWrapper(),
  )

  await act(async () => {
    hook.result.current.form.reset(makeCompanionValues(values))
  })

  return { ...hook, onSaved }
}

const submit = async (hook: Awaited<ReturnType<typeof setup>>) => {
  await act(async () => {
    hook.result.current.save.submit()
  })
}

describe("creating a companion", () => {
  it("creates the pet with the form values and finishes without a photo", async () => {
    apiClient.users.createPet.mockResolvedValue(ok(makePet({ id: "pet-new" })))
    const hook = await setup()

    await submit(hook)

    expect(apiClient.users.createPet).toHaveBeenCalledWith(
      "session-cookie",
      "user-1",
      toCreatePetBody(makeCompanionValues()),
    )
    expect(uploadFile).not.toHaveBeenCalled()
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })

  it("uploads a local photo to the new pet before finishing", async () => {
    apiClient.users.createPet.mockResolvedValue(ok(makePet({ id: "pet-new" })))
    const hook = await setup(undefined, { photoUri: "file:///photo.jpg" })

    await submit(hook)

    expect(apiClient.pets.preparePhotoUpload).toHaveBeenCalledWith(
      "session-cookie",
      "pet-new",
      { contentType: "image/jpeg" },
    )
    expect(uploadFile).toHaveBeenCalledWith(target, "file:///photo.jpg")
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })

  it("shows an error and does not finish when the pet cannot be created", async () => {
    apiClient.users.createPet.mockRejectedValue(new Error("boom"))
    const hook = await setup()

    await submit(hook)

    expect(toast.error).toHaveBeenCalledWith(
      translate("newCompanion.createError"),
    )
    expect(hook.onSaved).not.toHaveBeenCalled()
  })

  it("does not create a second pet when only the photo failed", async () => {
    apiClient.users.createPet.mockResolvedValue(ok(makePet({ id: "pet-new" })))
    jest.mocked(uploadFile).mockRejectedValueOnce(new Error("upload failed"))
    const hook = await setup(undefined, { photoUri: "file:///photo.jpg" })

    await submit(hook)

    expect(toast.error).toHaveBeenCalledWith(
      translate("common.photoErrors.uploadFailed"),
    )
    expect(hook.onSaved).not.toHaveBeenCalled()

    await submit(hook)

    expect(apiClient.users.createPet).toHaveBeenCalledTimes(1)
    expect(uploadFile).toHaveBeenCalledTimes(2)
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })
})

describe("editing a companion", () => {
  it("updates the given pet with the form values", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const hook = await setup("pet-9")

    await submit(hook)

    expect(apiClient.pets.update).toHaveBeenCalledWith(
      "session-cookie",
      "pet-9",
      toPetDetailsBody(makeCompanionValues()),
    )
    expect(apiClient.users.createPet).not.toHaveBeenCalled()
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })

  it("does not upload a photo that is already stored", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const hook = await setup("pet-9", { photoUri: "https://img/a.jpg" })

    await submit(hook)

    expect(uploadFile).not.toHaveBeenCalled()
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })

  it("uploads a newly picked photo to the edited pet", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const hook = await setup("pet-9", { photoUri: "file:///new.jpg" })

    await submit(hook)

    expect(apiClient.pets.preparePhotoUpload).toHaveBeenCalledWith(
      "session-cookie",
      "pet-9",
      { contentType: "image/jpeg" },
    )
    expect(hook.onSaved).toHaveBeenCalledTimes(1)
  })

  it("shows the edit error when updating fails", async () => {
    apiClient.pets.update.mockRejectedValue(new Error("boom"))
    const hook = await setup("pet-9")

    await submit(hook)

    expect(toast.error).toHaveBeenCalledWith(translate("editCompanion.error"))
    expect(hook.onSaved).not.toHaveBeenCalled()
  })
})
