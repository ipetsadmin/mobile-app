import { act } from "@testing-library/react-native"
import { useFormContext } from "react-hook-form"

import { createCompanionFormWrapper } from "@/test/companion-form-wrapper"
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/render-with-providers"

import type { CompanionValues } from "../schema/companion.schema"
import { useCompanionStep } from "./use-companion-step"

async function setup(fields: Parameters<typeof useCompanionStep>[0]["fields"]) {
  const onNext = jest.fn()
  const hook = await renderHookWithProviders(
    () => ({
      step: useCompanionStep({ fields, onNext }),
      form: useFormContext<CompanionValues>(),
      errors: useFormContext<CompanionValues>().formState.errors,
    }),
    createTestQueryClient(),
    createCompanionFormWrapper(),
  )

  return { ...hook, onNext }
}

describe("useCompanionStep", () => {
  it("moves on when the fields of the step are valid", async () => {
    const { result, onNext } = await setup(["name"])

    await act(async () => {
      result.current.form.setValue("name", "Luna")
      await result.current.step.goNext()
    })

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("stays on the step and reports the error when a field is invalid", async () => {
    const { result, onNext } = await setup(["name"])

    await act(async () => {
      await result.current.step.goNext()
    })

    expect(onNext).not.toHaveBeenCalled()
    expect(result.current.errors.name?.message).toBe("validation.required")
  })

  it("only validates the fields of the step", async () => {
    const { result, onNext } = await setup(["name"])

    await act(async () => {
      result.current.form.setValue("name", "Luna")
      await result.current.step.goNext()
    })

    expect(onNext).toHaveBeenCalled()
    expect(result.current.errors.weight).toBeUndefined()
  })

  it("clears the error as soon as the user fixes the field", async () => {
    const { result } = await setup(["name"])

    await act(async () => {
      await result.current.step.goNext()
    })
    await act(async () => {
      result.current.form.setValue("name", "Luna")
    })

    expect(result.current.errors.name).toBeUndefined()
  })

  it("clearField empties a value", async () => {
    const { result } = await setup(["name"])

    await act(async () => {
      result.current.form.setValue("name", "Luna")
      result.current.step.clearField("name")
    })

    expect(result.current.form.getValues("name")).toBeUndefined()
  })
})
