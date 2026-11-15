import { screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { FieldShell } from "./field-shell"

describe("FieldShell", () => {
  it("shows the label followed by a dot and the content", async () => {
    await renderWithProviders(
      <FieldShell label="Name">
        <Text>content</Text>
      </FieldShell>,
    )

    expect(screen.getByText("Name ·")).toBeOnTheScreen()
    expect(screen.getByText("content")).toBeOnTheScreen()
  })

  it("shows the label hint next to the label", async () => {
    await renderWithProviders(
      <FieldShell label="Reason" labelHint="Optional" />,
    )

    expect(screen.getByText("Optional")).toBeOnTheScreen()
  })

  it("shows the hint when there is no error", async () => {
    await renderWithProviders(
      <FieldShell label="Name" hint="As on the passport" />,
    )

    expect(screen.getByText("As on the passport")).toBeOnTheScreen()
  })

  it("shows the translated error instead of the hint", async () => {
    await renderWithProviders(
      <FieldShell
        label="Name"
        hint="As on the passport"
        errorKey="validation.required"
      />,
    )

    expect(screen.getByText(translate("validation.required"))).toBeOnTheScreen()
    expect(screen.queryByText("As on the passport")).not.toBeOnTheScreen()
  })
})
