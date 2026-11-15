import { NotNeuteredReason as ContractReason } from "@ipetsadmin/contracts"

import { NotNeuteredReason } from "../schema/companion.schema"
import { fromContractReason, toContractReason } from "./not-neutered-reasons"

describe("not neutered reasons", () => {
  it("maps every form reason to a contract reason", () => {
    expect(Object.keys(toContractReason).sort()).toEqual(
      Object.values(NotNeuteredReason).sort(),
    )
  })

  it("maps every contract reason to a form reason", () => {
    expect(Object.keys(fromContractReason).sort()).toEqual(
      Object.values(ContractReason).sort(),
    )
  })

  it.each(Object.values(NotNeuteredReason))("round trips %s", (reason) => {
    expect(fromContractReason[toContractReason[reason]]).toBe(reason)
  })
})
