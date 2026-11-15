import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionHeaderActions } from "./companion-header-actions"

describe("CompanionHeaderActions", () => {
  it("opens the health card", async () => {
    const onOpenHealthCard = jest.fn()
    const onEdit = jest.fn()
    await renderWithProviders(
      <CompanionHeaderActions
        onOpenHealthCard={onOpenHealthCard}
        onEdit={onEdit}
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("healthCard.open") }),
    )

    expect(onOpenHealthCard).toHaveBeenCalledTimes(1)
    expect(onEdit).not.toHaveBeenCalled()
  })

  it("starts editing the companion", async () => {
    const onOpenHealthCard = jest.fn()
    const onEdit = jest.fn()
    await renderWithProviders(
      <CompanionHeaderActions
        onOpenHealthCard={onOpenHealthCard}
        onEdit={onEdit}
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("editCompanion.open") }),
    )

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onOpenHealthCard).not.toHaveBeenCalled()
  })
})
