import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionsEmptyState } from "./companions-empty-state"

describe("CompanionsEmptyState", () => {
  it("explains there are no companions yet", async () => {
    await renderWithProviders(
      <CompanionsEmptyState onNewCompanion={jest.fn()} />,
    )

    expect(
      screen.getByRole("header", { name: translate("companions.empty.title") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("companions.empty.eyebrow")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("companions.empty.body")),
    ).toBeOnTheScreen()
  })

  it("starts creating a companion", async () => {
    const onNewCompanion = jest.fn()
    await renderWithProviders(
      <CompanionsEmptyState onNewCompanion={onNewCompanion} />,
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("companions.newCompanion.title"),
      }),
    )

    expect(onNewCompanion).toHaveBeenCalledTimes(1)
  })
})
