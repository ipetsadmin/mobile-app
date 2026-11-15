import { WeightUnit } from "@ipetsadmin/contracts"

import { makePet } from "@/test/factories/make-pet"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { toCompanionValues } from "../data/to-companion-values"
import { BirthDateMode, TogetherMode } from "../schema/companion.schema"
import { useCompanionForm } from "./use-companion-form"

describe("useCompanionForm", () => {
  it("starts empty for a new companion", async () => {
    const { result } = await renderHookWithProviders(() => useCompanionForm())

    expect(result.current.getValues()).toMatchObject({
      name: "",
      weight: "",
      weightUnit: WeightUnit.KG,
      isNeutered: false,
      microchipNumber: "",
      birth: { mode: BirthDateMode.EXACT },
      together: { mode: TogetherMode.SINCE_BIRTH },
    })
    expect(result.current.getValues().species).toBeUndefined()
  })

  it("starts with the values of an existing pet", async () => {
    const pet = makePet({ name: "Rocky" })

    const { result } = await renderHookWithProviders(() =>
      useCompanionForm(pet),
    )

    expect(result.current.getValues()).toEqual(toCompanionValues(pet))
  })
})
