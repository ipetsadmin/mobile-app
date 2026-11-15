import { screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { FieldError } from "./field-error"

describe("FieldError", () => {
  it("shows the translated message of the error key", async () => {
    await renderWithProviders(<FieldError errorKey="validation.required" />)

    expect(screen.getByText(translate("validation.required"))).toBeOnTheScreen()
  })

  it("renders nothing without an error", async () => {
    await renderWithProviders(<FieldError />)

    expect(screen.queryAllByText(/.+/)).toHaveLength(0)
  })
})
