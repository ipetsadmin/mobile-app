import { CatBreed, DogBreed, Species } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"
import { useFormContext } from "react-hook-form"

import { createCompanionFormWrapper } from "@/test/companion-form-wrapper"
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/render-with-providers"

import type { CompanionValues } from "../schema/companion.schema"
import { useBreedOptions } from "./use-breed-options"

async function setup() {
  return renderHookWithProviders(
    () => ({
      options: useBreedOptions(),
      form: useFormContext<CompanionValues>(),
    }),
    createTestQueryClient(),
    createCompanionFormWrapper(),
  )
}

describe("useBreedOptions", () => {
  it("has no options before choosing a species", async () => {
    const { result } = await setup()

    expect(result.current.options).toEqual([])
  })

  it("lists the dog breeds for a dog", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.form.setValue("species", Species.DOG)
    })

    expect(result.current.options).toHaveLength(Object.values(DogBreed).length)
    expect(result.current.options[0]).toEqual({
      value: Object.values(DogBreed)[0],
      label: Object.values(DogBreed)[0],
    })
  })

  it("lists the cat breeds for a cat", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.form.setValue("species", Species.CAT)
    })

    expect(result.current.options.map((option) => option.value)).toEqual(
      Object.values(CatBreed),
    )
  })

  it("follows the species when it changes", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.form.setValue("species", Species.DOG)
    })
    await act(async () => {
      result.current.form.setValue("species", Species.CAT)
    })

    expect(result.current.options.map((option) => option.value)).not.toContain(
      Object.values(DogBreed)[0],
    )
  })
})
