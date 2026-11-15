import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { StepProgress } from "./step-progress"

const tree = () => JSON.stringify(screen.toJSON())

describe("StepProgress", () => {
  it("announces the current step as a progress bar from one to the total", async () => {
    await renderWithProviders(<StepProgress current={3} total={9} />)

    expect(tree()).toContain('"accessibilityRole":"progressbar"')
    expect(tree()).toContain('"accessibilityValue":{"min":1,"max":9,"now":3}')
  })

  it("draws one dot per step", async () => {
    await renderWithProviders(<StepProgress current={1} total={5} />)

    const dots = tree().match(/"borderRadius"/g) ?? []

    expect(dots.length).toBeGreaterThanOrEqual(5)
  })
})
