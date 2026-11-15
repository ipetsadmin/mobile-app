import { fireEvent, screen } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionDetailScreen } from "./companion-detail-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const handlers = () => ({
  onAddVaccine: jest.fn(),
  onAddAppointment: jest.fn(),
  onAddTreatment: jest.fn(),
})

beforeEach(() => {
  apiClient.users.getProfile.mockResolvedValue(
    ok({ profile: { firstName: "Ana", lastName: "Gomez" } }),
  )
  apiClient.pets.getTreatments.mockResolvedValue(ok([]))
  apiClient.pets.getAppointments.mockResolvedValue(ok([]))
})

describe("CompanionDetailScreen", () => {
  it("shows a spinner while the pet is loading", async () => {
    apiClient.pets.getById.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(
      <CompanionDetailScreen petId="pet-1" {...handlers()} />,
    )

    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.pets.getById.mockRejectedValueOnce(new Error("boom"))
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ name: "Luna" })))

    await renderWithProviders(
      <CompanionDetailScreen petId="pet-1" {...handlers()} />,
    )
    await fireEvent.press(
      await screen.findByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText("Luna")).toBeOnTheScreen()
  })

  it("shows the pet with its three tabs", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ name: "Luna" })))

    await renderWithProviders(
      <CompanionDetailScreen petId="pet-1" {...handlers()} />,
    )

    expect(await screen.findByText("Luna")).toBeOnTheScreen()
    expect(
      screen.getByRole("tab", { name: translate("healthCard.tabs.overview") }),
    ).toBeSelected()
    expect(
      screen.getByRole("tab", { name: translate("healthCard.tabs.health") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByRole("tab", {
        name: translate("healthCard.tabs.appointments"),
      }),
    ).toBeOnTheScreen()
  })

  it("shows the caretaker in the overview", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet()))

    await renderWithProviders(
      <CompanionDetailScreen petId="pet-1" {...handlers()} />,
    )

    expect(await screen.findByText("Ana Gomez")).toBeOnTheScreen()
  })

  it("loads the pet by id", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet({ id: "pet-9" })))

    await renderWithProviders(
      <CompanionDetailScreen petId="pet-9" {...handlers()} />,
    )

    await screen.findByText("Luna")
    expect(apiClient.pets.getById).toHaveBeenCalledWith(
      "session-cookie",
      "pet-9",
    )
  })

  it("offers to add a vaccine, a treatment and an appointment from the overview", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet()))
    const props = handlers()
    await renderWithProviders(
      <CompanionDetailScreen petId="pet-1" {...props} />,
    )
    await screen.findByText("Luna")

    await fireEvent.press(
      screen.getByRole("button", { name: translate("addMenu.open") }),
    )
    await fireEvent.press(
      screen.getByRole("button", { name: translate("vaccine.add") }),
    )

    expect(props.onAddVaccine).toHaveBeenCalledTimes(1)
  })
})
