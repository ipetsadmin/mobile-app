import { fireEvent, screen } from "@testing-library/react-native"
import { Share } from "react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { HealthCardScreen } from "./health-card-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

beforeEach(() => {
  apiClient.users.getProfile.mockResolvedValue(
    ok({ profile: { firstName: "Ana", lastName: "Gomez" } }),
  )
})

describe("HealthCardScreen", () => {
  it("shows a spinner while loading", async () => {
    apiClient.pets.getById.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(<HealthCardScreen petId="pet-1" />)

    expect(
      screen.queryByText(translate("healthCard.notFound")),
    ).not.toBeOnTheScreen()
    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.pets.getById.mockRejectedValueOnce(new Error("boom"))
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ name: "Luna" })))

    await renderWithProviders(<HealthCardScreen petId="pet-1" />)
    await fireEvent.press(
      await screen.findByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText("Luna")).toBeOnTheScreen()
  })

  it("shows the card of the pet with the caretaker and the share hint", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ name: "Luna" })))

    await renderWithProviders(<HealthCardScreen petId="pet-1" />)

    expect(await screen.findByText("Luna")).toBeOnTheScreen()
    expect(await screen.findByText("Ana Gomez")).toBeOnTheScreen()
    expect(
      screen.getByText(translate("healthCard.shareHint")),
    ).toBeOnTheScreen()
  })

  it("shares the card with the name of the pet", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ name: "Luna" })))
    const share = jest
      .spyOn(Share, "share")
      .mockResolvedValue({ action: "sharedAction" })
    await renderWithProviders(<HealthCardScreen petId="pet-1" />)

    await fireEvent.press(
      await screen.findByRole("button", {
        name: translate("healthCard.share"),
      }),
    )

    expect(share).toHaveBeenCalledWith({
      message: translate("healthCard.shareMessage", { name: "Luna" }),
    })
  })
})
