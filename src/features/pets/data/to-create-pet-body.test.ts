import { PetStatus } from "@ipetsadmin/contracts"

import { makeCompanionValues } from "@/test/factories/make-companion-values"

import { toCreatePetBody } from "./to-create-pet-body"
import { toPetDetailsBody } from "./to-pet-details-body"

describe("toCreatePetBody", () => {
  it("includes everything from the details body", () => {
    const values = makeCompanionValues()

    expect(toCreatePetBody(values)).toMatchObject(toPetDetailsBody(values))
  })

  it("starts the pet as active with empty extras", () => {
    expect(toCreatePetBody(makeCompanionValues())).toMatchObject({
      status: PetStatus.ACTIVE,
      color: "",
      description: "",
      allergies: [],
    })
  })
})
