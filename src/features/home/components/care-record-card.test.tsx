import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CareRecordCard } from "./care-record-card"

const props = {
  title: "Luna's care record",
  body: "Everything in one place",
  actionLabel: "Open",
}

describe("CareRecordCard", () => {
  it("shows the title, the body and the action with an arrow", async () => {
    await renderWithProviders(<CareRecordCard {...props} onPress={jest.fn()} />)

    expect(screen.getByText("Luna's care record")).toBeOnTheScreen()
    expect(screen.getByText("Everything in one place")).toBeOnTheScreen()
    expect(screen.getByText("Open →")).toBeOnTheScreen()
  })

  it("is a button labelled with the action and calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<CareRecordCard {...props} onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "Open" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
