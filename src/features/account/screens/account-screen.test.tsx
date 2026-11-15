import { fireEvent, screen } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { AccountScreen } from "./account-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

beforeEach(() => {
  apiClient.users.getProfile.mockResolvedValue(
    ok({
      profile: { firstName: "Ana", lastName: "Gomez", avatar: null },
      preferences: { notifications: { push: false, email: true } },
    }),
  )
})

describe("AccountScreen", () => {
  it("shows the profile of the user", async () => {
    await renderWithProviders(
      <AccountScreen onOpen={jest.fn()} onSignOut={jest.fn()} />,
    )

    expect(await screen.findByText("Ana Gomez")).toBeOnTheScreen()
    expect(screen.getAllByText("ana@example.com").length).toBeGreaterThan(0)
  })

  it("opens the profile editor from the profile card", async () => {
    const onOpen = jest.fn()
    await renderWithProviders(
      <AccountScreen onOpen={onOpen} onSignOut={jest.fn()} />,
    )

    await fireEvent.press(
      await screen.findByRole("button", { name: "Ana Gomez" }),
    )

    expect(onOpen).toHaveBeenCalledWith("profile")
  })

  it("shows the appearance and the settings groups", async () => {
    await renderWithProviders(
      <AccountScreen onOpen={jest.fn()} onSignOut={jest.fn()} />,
    )

    expect(
      screen.getByText(`${translate("account.appearance.label")} ·`),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(`${translate("account.groups.account")} ·`),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(`${translate("account.groups.preferences")} ·`),
    ).toBeOnTheScreen()
  })

  it("opens a settings section", async () => {
    const onOpen = jest.fn()
    await renderWithProviders(
      <AccountScreen onOpen={onOpen} onSignOut={jest.fn()} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("account.rows.language") }),
    )

    expect(onOpen).toHaveBeenCalledWith("language")
  })

  it("asks to sign out", async () => {
    const onSignOut = jest.fn()
    await renderWithProviders(
      <AccountScreen onOpen={jest.fn()} onSignOut={onSignOut} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("account.signOut") }),
    )

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })
})
