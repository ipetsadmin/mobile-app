import { act } from "@testing-library/react-native"
import { useFormContext } from "react-hook-form"

import { createCompanionFormWrapper } from "@/test/companion-form-wrapper"
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/render-with-providers"

import {
  BirthDateMode,
  type CompanionValues,
  TogetherMode,
} from "../schema/companion.schema"
import { useTimeTogetherStep } from "./use-time-together-step"

const birth = new Date(2023, 2, 10)

type BirthMode = (typeof BirthDateMode)[keyof typeof BirthDateMode]

async function setup(birthMode: BirthMode = BirthDateMode.UNSURE) {
  const onNext = jest.fn()
  const hook = await renderHookWithProviders(
    () => ({
      step: useTimeTogetherStep({ onNext }),
      form: useFormContext<CompanionValues>(),
    }),
    createTestQueryClient(),
    createCompanionFormWrapper(),
  )

  await act(async () => {
    hook.result.current.form.setValue("birth", { mode: birthMode, date: birth })
  })

  return { ...hook, onNext }
}

describe("useTimeTogetherStep", () => {
  it("exposes the birth date chosen in the previous step", async () => {
    const { result } = await setup()

    expect(result.current.step.birthDate).toEqual(birth)
  })

  it("locks the date to the birth date only when it is exact", async () => {
    const exact = await setup(BirthDateMode.EXACT)
    const unsure = await setup(BirthDateMode.UNSURE)

    expect(exact.result.current.step.isLockedToBirthDate).toBe(true)
    expect(unsure.result.current.step.isLockedToBirthDate).toBe(false)
  })

  it("copies the birth date when the mode is since birth", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.step.matchDateToMode(TogetherMode.SINCE_BIRTH)
    })

    expect(result.current.form.getValues("together.date")).toEqual(birth)
  })

  it("leaves the date alone for any other mode", async () => {
    const { result } = await setup()
    const before = result.current.form.getValues("together.date")

    await act(async () => {
      result.current.step.matchDateToMode(TogetherMode.JOINED_LATER)
    })

    expect(result.current.form.getValues("together.date")).toEqual(before)
  })

  it("switches to since birth when the picked date is the birth day", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.step.matchModeToDate(new Date(2023, 2, 10, 18))
    })

    expect(result.current.form.getValues("together.mode")).toBe(
      TogetherMode.SINCE_BIRTH,
    )
  })

  it("switches to joined later when the picked date is another day", async () => {
    const { result } = await setup()

    await act(async () => {
      result.current.step.matchModeToDate(new Date(2023, 5, 1))
    })

    expect(result.current.form.getValues("together.mode")).toBe(
      TogetherMode.JOINED_LATER,
    )
  })
})
