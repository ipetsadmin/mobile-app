import { fireEvent, screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { EditCompanionGate } from "./edit-companion-gate"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const renderGate = (onClose = jest.fn()) =>
  renderWithProviders(
    <EditCompanionGate petId="pet-1" onClose={onClose}>
      <Text>edit form</Text>
    </EditCompanionGate>,
  )

describe("EditCompanionGate", () => {
  it("does not show the form while the pet is loading", async () => {
    apiClient.pets.getById.mockReturnValue(new Promise(() => {}))

    await renderGate()

    expect(screen.queryByText("edit form")).not.toBeOnTheScreen()
    expect(
      screen.getByRole("button", { name: translate("common.close") }),
    ).toBeOnTheScreen()
  })

  it("shows the form once the pet has loaded", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet()))

    await renderGate()

    expect(await screen.findByText("edit form")).toBeOnTheScreen()
  })

  it("shows the error with a retry that loads the pet again", async () => {
    apiClient.pets.getById.mockRejectedValueOnce(new Error("boom"))
    apiClient.pets.getById.mockResolvedValue(ok(makePet()))

    await renderGate()
    expect(
      await screen.findByText(translate("common.loadError")),
    ).toBeOnTheScreen()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText("edit form")).toBeOnTheScreen()
    expect(apiClient.pets.getById).toHaveBeenCalledTimes(2)
  })

  it("closes from the close button while loading or failing", async () => {
    apiClient.pets.getById.mockReturnValue(new Promise(() => {}))
    const onClose = jest.fn()
    await renderGate(onClose)

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.close") }),
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
