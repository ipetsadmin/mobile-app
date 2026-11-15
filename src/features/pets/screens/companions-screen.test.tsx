import { fireEvent, screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionsScreen } from "./companions-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const handlers = () => ({
  onOpenCompanion: jest.fn(),
  onNewCompanion: jest.fn(),
})

describe("CompanionsScreen", () => {
  it("shows the title and the subtitle", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([makePet()]))

    await renderWithProviders(<CompanionsScreen {...handlers()} />)

    expect(
      screen.getByRole("header", { name: translate("companions.title") }),
    ).toBeOnTheScreen()
    expect(screen.getByText(translate("companions.subtitle"))).toBeOnTheScreen()
  })

  it("shows a spinner while loading", async () => {
    apiClient.users.getPets.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(<CompanionsScreen {...handlers()} />)

    expect(
      screen.queryByText(translate("companions.empty.title")),
    ).not.toBeOnTheScreen()
    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.users.getPets.mockRejectedValueOnce(new Error("boom"))
    apiClient.users.getPets.mockResolvedValue(ok([makePet({ name: "Luna" })]))

    await renderWithProviders(<CompanionsScreen {...handlers()} />)
    await fireEvent.press(
      await screen.findByRole("button", { name: translate("common.retry") }),
    )

    expect(
      await screen.findByRole("button", { name: "Luna" }),
    ).toBeOnTheScreen()
  })

  it("shows the empty state and starts creating a companion", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([]))
    const props = handlers()
    await renderWithProviders(<CompanionsScreen {...props} />)

    expect(
      await screen.findByText(translate("companions.empty.title")),
    ).toBeOnTheScreen()
    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("companions.newCompanion.title"),
      }),
    )

    expect(props.onNewCompanion).toHaveBeenCalledTimes(1)
  })

  it("lists the companions and opens the pressed one", async () => {
    apiClient.users.getPets.mockResolvedValue(
      ok([
        makePet({ id: "pet-1", name: "Luna" }),
        makePet({ id: "pet-2", name: "Rocky" }),
      ]),
    )
    const props = handlers()
    await renderWithProviders(<CompanionsScreen {...props} />)

    await fireEvent.press(await screen.findByRole("button", { name: "Rocky" }))

    expect(props.onOpenCompanion).toHaveBeenCalledWith("pet-2")
    expect(screen.getByRole("button", { name: "Luna" })).toBeOnTheScreen()
  })

  it("offers a card to add another companion once there are some", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([makePet()]))
    const props = handlers()
    await renderWithProviders(<CompanionsScreen {...props} />)

    await fireEvent.press(
      await screen.findByRole("button", {
        name: translate("companions.newCompanion.title"),
      }),
    )

    expect(props.onNewCompanion).toHaveBeenCalledTimes(1)
  })
})
