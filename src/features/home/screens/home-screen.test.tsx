import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, screen } from "@testing-library/react-native"

import { makeDoseItem } from "@/test/factories/make-agenda-item"
import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { HomeScreen } from "./home-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const handlers = () => ({
  onOpenNotifications: jest.fn(),
  onOpenCompanion: jest.fn(),
  onNewCompanion: jest.fn(),
})

const today = () => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)

  return date
}

beforeEach(async () => {
  await AsyncStorage.setItem("push-prompt-answered", "true")
  apiClient.users.getProfile.mockResolvedValue(
    ok({
      profile: { firstName: "Ana", lastName: "Gomez" },
      preferences: { notifications: { push: false, email: true } },
    }),
  )
  apiClient.users.getAgenda.mockResolvedValue(ok({ items: [] }))
  apiClient.users.getPets.mockResolvedValue(ok([]))
})

describe("HomeScreen", () => {
  it("greets the user by first name", async () => {
    await renderWithProviders(<HomeScreen {...handlers()} />)

    expect(
      await screen.findByRole("header", { name: /Ana$/ }),
    ).toBeOnTheScreen()
  })

  it("opens the notifications from the bell", async () => {
    const props = handlers()
    await renderWithProviders(<HomeScreen {...props} />)

    await fireEvent.press(
      screen.getByRole("button", { name: translate("home.notifications") }),
    )

    expect(props.onOpenNotifications).toHaveBeenCalledTimes(1)
  })

  it("invites to add the first companion when there are none", async () => {
    const props = handlers()
    await renderWithProviders(<HomeScreen {...props} />)

    await fireEvent.press(
      await screen.findByRole("button", {
        name: translate("home.firstCompanion.action"),
      }),
    )

    expect(props.onNewCompanion).toHaveBeenCalledTimes(1)
  })

  it("shows the care record of the first companion and opens it", async () => {
    apiClient.users.getPets.mockResolvedValue(
      ok([
        makePet({ id: "pet-9", name: "Luna" }),
        makePet({ id: "pet-2", name: "Rocky" }),
      ]),
    )
    const props = handlers()
    await renderWithProviders(<HomeScreen {...props} />)

    expect(
      await screen.findByText(
        translate("home.careRecord.title", { name: "Luna" }),
      ),
    ).toBeOnTheScreen()
    await fireEvent.press(
      screen.getByRole("button", { name: translate("home.careRecord.action") }),
    )

    expect(props.onOpenCompanion).toHaveBeenCalledWith("pet-9")
  })

  it("counts the companions in the greeting", async () => {
    apiClient.users.getPets.mockResolvedValue(
      ok([makePet({ id: "a" }), makePet({ id: "b" })]),
    )
    await renderWithProviders(<HomeScreen {...handlers()} />)

    expect(
      await screen.findByText(translate("home.companions", { count: 2 })),
    ).toBeOnTheScreen()
  })

  it("shows the error with a retry when the companions fail to load", async () => {
    apiClient.users.getPets.mockRejectedValueOnce(new Error("boom"))
    apiClient.users.getPets.mockResolvedValue(ok([makePet({ name: "Luna" })]))
    await renderWithProviders(<HomeScreen {...handlers()} />)

    await fireEvent.press(
      await screen.findByRole("button", { name: translate("common.retry") }),
    )

    expect(
      await screen.findByText(
        translate("home.careRecord.title", { name: "Luna" }),
      ),
    ).toBeOnTheScreen()
  })

  it("lists what is coming this week and opens the pet of an item", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([makePet({ id: "pet-1" })]))
    apiClient.users.getAgenda.mockResolvedValue(
      ok({
        items: [
          makeDoseItem({
            medicationName: "Amoxicillin",
            petName: "Luna",
            petId: "pet-1",
            occursAt: today(),
          }),
        ],
      }),
    )
    const props = handlers()
    await renderWithProviders(<HomeScreen {...props} />)

    await fireEvent.press(
      await screen.findByRole("button", { name: /Amoxicillin · Luna/ }),
    )

    expect(props.onOpenCompanion).toHaveBeenCalledWith("pet-1")
    expect(apiClient.users.getAgenda).toHaveBeenCalledWith("session-cookie", 7)
  })

  it("shows the empty week when nothing is coming", async () => {
    await renderWithProviders(<HomeScreen {...handlers()} />)

    expect(
      await screen.findByText(translate("home.week.emptyTitle")),
    ).toBeOnTheScreen()
  })
})
