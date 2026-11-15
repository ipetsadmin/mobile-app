import { TreatmentStatus, TreatmentType } from "@ipetsadmin/contracts"

import type { VaccineValues } from "../schema/vaccine.schema"
import { toCreateVaccineBody } from "./to-create-vaccine-body"

const administeredAt = new Date("2026-06-10T10:00:00.000Z")

const values: VaccineValues = {
  name: "  Rabies ",
  administeredAt,
  laboratory: "Zoetis",
  lotNumber: "L-123",
  notes: "No reaction",
}

describe("toCreateVaccineBody", () => {
  it("registers a completed vaccination with a single dose", () => {
    const body = toCreateVaccineBody("user-1", values)

    expect(body).toMatchObject({
      ownerId: "user-1",
      treatmentType: TreatmentType.VACCINATION,
      status: TreatmentStatus.COMPLETED,
      totalDoses: 1,
      durationDays: 1,
      frequencyHours: 0,
      startDate: administeredAt,
    })
  })

  it("trims the name and keeps the notes as instructions", () => {
    const body = toCreateVaccineBody("user-1", values)

    expect(body.medicationName).toBe("Rabies")
    expect(body.instructions).toBe("No reaction")
  })

  it("includes vaccination details when laboratory and lot are present", () => {
    expect(toCreateVaccineBody("user-1", values).vaccinationDetails).toEqual({
      laboratory: "Zoetis",
      lotNumber: "L-123",
      administeredAt,
    })
  })

  it.each([
    { laboratory: undefined, lotNumber: undefined },
    { laboratory: "Zoetis", lotNumber: undefined },
    { laboratory: undefined, lotNumber: "L-123" },
    { laboratory: "", lotNumber: "" },
  ])("omits vaccination details for %p", (details) => {
    const body = toCreateVaccineBody("user-1", { ...values, ...details })

    expect(body.vaccinationDetails).toBeUndefined()
  })

  it("sends no instructions without notes", () => {
    expect(
      toCreateVaccineBody("user-1", { ...values, notes: "" }).instructions,
    ).toBeUndefined()
  })
})
