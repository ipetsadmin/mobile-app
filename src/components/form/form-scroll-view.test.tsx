import { screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { FormScrollView } from "./form-scroll-view"

describe("FormScrollView", () => {
  it("renders its children", async () => {
    await renderWithProviders(
      <FormScrollView>
        <Text>field</Text>
      </FormScrollView>,
    )

    expect(screen.getByText("field")).toBeOnTheScreen()
  })
})
