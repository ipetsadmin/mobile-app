import { TreatmentStatus, TreatmentType } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makeTreatment } from "@/test/factories/make-treatment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { ActiveTreatments } from "./active-treatments"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("ActiveTreatments", () => {
  it("shows only unfinished treatments that are not vaccines", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([
        makeTreatment({ id: "a", medicationName: "Active" }),
        makeTreatment({
          id: "b",
          medicationName: "Finished",
          status: TreatmentStatus.COMPLETED,
        }),
        makeTreatment({
          id: "c",
          medicationName: "Cancelled",
          status: TreatmentStatus.CANCELLED,
        }),
        makeTreatment({
          id: "d",
          medicationName: "Rabies",
          treatmentType: TreatmentType.VACCINATION,
        }),
      ]),
    )

    await renderWithProviders(<ActiveTreatments petId="pet-1" />)

    expect(await screen.findByText("Active")).toBeOnTheScreen()
    expect(
      screen.getByText(translate("treatment.activeTitle")),
    ).toBeOnTheScreen()
    expect(screen.queryByText("Finished")).not.toBeOnTheScreen()
    expect(screen.queryByText("Cancelled")).not.toBeOnTheScreen()
    expect(screen.queryByText("Rabies")).not.toBeOnTheScreen()
  })

  it("renders nothing when there is no active treatment", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([makeTreatment({ status: TreatmentStatus.COMPLETED })]),
    )

    await renderWithProviders(<ActiveTreatments petId="pet-1" />)

    expect(
      screen.queryByText(translate("treatment.activeTitle")),
    ).not.toBeOnTheScreen()
  })
})
