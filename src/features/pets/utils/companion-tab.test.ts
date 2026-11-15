import { companionTabs } from "./companion-tab"

describe("companionTabs", () => {
  it("lists the detail tabs in display order", () => {
    expect(companionTabs).toEqual(["overview", "health", "appointments"])
  })
})
