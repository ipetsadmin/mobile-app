import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { CompanionsListEmpty } from "./companions-list-empty"

const props = { onRetry: jest.fn(), onNewCompanion: jest.fn() }

describe("CompanionsListEmpty", () => {
  it("shows only a spinner while loading", async () => {
    await renderWithProviders(
      <CompanionsListEmpty {...props} isPending isError={false} />,
    )

    expect(
      screen.queryByText(translate("companions.empty.title")),
    ).not.toBeOnTheScreen()
    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    const onRetry = jest.fn()
    await renderWithProviders(
      <CompanionsListEmpty
        {...props}
        onRetry={onRetry}
        isPending={false}
        isError
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.retry") }),
    )

    expect(screen.getByText(translate("common.loadError"))).toBeOnTheScreen()
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("shows the empty state once loaded without error", async () => {
    await renderWithProviders(
      <CompanionsListEmpty {...props} isPending={false} isError={false} />,
    )

    expect(
      screen.getByText(translate("companions.empty.title")),
    ).toBeOnTheScreen()
  })

  it("prefers the loading state over an error", async () => {
    await renderWithProviders(
      <CompanionsListEmpty {...props} isPending isError />,
    )

    expect(
      screen.queryByText(translate("common.loadError")),
    ).not.toBeOnTheScreen()
  })
})
