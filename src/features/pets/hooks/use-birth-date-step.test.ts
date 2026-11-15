import { act } from "@testing-library/react-native"
import { useFormContext } from "react-hook-form"
import { createCompanionFormWrapper } from "@/test/companion-form-wrapper"
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/render-with-providers"
import { subtractYears } from "@/utils/calendar"

import {
  BirthDateMode,
  type CompanionValues,
  MAX_PET_AGE_YEARS,
  TogetherMode,
} from "../schema/companion.schema"
import { useBirthDateStep } from "./use-birth-date-step"

async function setup() {
  const onNext = jest.fn()
  const hook = await renderHookWithProviders(
    () => ({
      step: useBirthDateStep({ onNext }),
      form: useFormContext<CompanionValues>(),
    }),
    createTestQueryClient(),
    createCompanionFormWrapper(),
  )

  return { ...hook, onNext }
}

const lastYear = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)

  return date
}

describe("useBirthDateStep", () => {
  it("limits the birth date to today and the maximum pet age", async () => {
    const { result } = await setup()

    const { latestBirthDate, earliestBirthDate } = result.current.step

    expect(subtractYears(latestBirthDate, MAX_PET_AGE_YEARS)).toEqual(
      earliestBirthDate,
    )
  })

  it("moves on with an exact birth date and syncs the time together", async () => {
    const { result, onNext } = await setup()
    const birth = lastYear()

    await act(async () => {
      result.current.form.setValue("birth", {
        mode: BirthDateMode.EXACT,
        date: birth,
      })
      result.current.form.setValue("together", {
        mode: TogetherMode.JOINED_LATER,
        date: new Date(),
      })
      await result.current.step.goNext()
    })

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(result.current.form.getValues("together")).toEqual({
      mode: TogetherMode.SINCE_BIRTH,
      date: birth,
    })
  })

  it("keeps a later together date when the birth date is approximate", async () => {
    const { result } = await setup()
    const birth = lastYear()
    const together = new Date()

    await act(async () => {
      result.current.form.setValue("birth", {
        mode: BirthDateMode.UNSURE,
        date: birth,
      })
      result.current.form.setValue("together", {
        mode: TogetherMode.JOINED_LATER,
        date: together,
      })
      await result.current.step.goNext()
    })

    expect(result.current.form.getValues("together")).toEqual({
      mode: TogetherMode.JOINED_LATER,
      date: together,
    })
  })

  it("moves the together date up to the birth date when it would be earlier", async () => {
    const { result } = await setup()
    const birth = lastYear()
    const earlier = new Date(birth)
    earlier.setFullYear(earlier.getFullYear() - 2)

    await act(async () => {
      result.current.form.setValue("birth", {
        mode: BirthDateMode.UNSURE,
        date: birth,
      })
      result.current.form.setValue("together", {
        mode: TogetherMode.JOINED_LATER,
        date: earlier,
      })
      await result.current.step.goNext()
    })

    expect(result.current.form.getValues("together.date")).toEqual(birth)
  })

  it("does not move on with a birth date in the future", async () => {
    const { result, onNext } = await setup()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 2)

    await act(async () => {
      result.current.form.setValue("birth", {
        mode: BirthDateMode.EXACT,
        date: tomorrow,
      })
      await result.current.step.goNext()
    })

    expect(onNext).not.toHaveBeenCalled()
  })
})
