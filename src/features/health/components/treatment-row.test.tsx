import { TreatmentStatus, TreatmentType } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makeTreatment } from "@/test/factories/make-treatment"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { TreatmentRow } from "./treatment-row"

describe("TreatmentRow", () => {
  it("shows the medication, its type with the dose, and the status with the end date", async () => {
    await renderWithProviders(
      <TreatmentRow
        treatment={makeTreatment({
          medicationName: "Amoxicillin",
          dosage: "1 tablet",
          treatmentType: TreatmentType.MEDICATION,
          status: TreatmentStatus.IN_PROGRESS,
          endDate: new Date(2026, 5, 15),
        })}
      />,
    )

    expect(screen.getByText("Amoxicillin")).toBeOnTheScreen()
    expect(
      screen.getByText(`${translate("treatment.types.medication")} · 1 tablet`),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(
        `${translate("treatment.status.inProgress")} · ${translate("treatment.until", { date: "15 jun 2026" })}`,
      ),
    ).toBeOnTheScreen()
  })

  it("shows only the status when there is no end date", async () => {
    await renderWithProviders(
      <TreatmentRow
        treatment={makeTreatment({
          endDate: undefined,
          status: TreatmentStatus.PENDING,
        })}
      />,
    )

    expect(
      screen.getByText(translate("treatment.status.pending")),
    ).toBeOnTheScreen()
  })
})
