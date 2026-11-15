import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { SocialSignIn } from "./social-sign-in"

describe("SocialSignIn", () => {
  it("continues with google when its button is pressed", async () => {
    const onContinueWithGoogle = jest.fn()
    await renderWithProviders(
      <SocialSignIn
        onContinueWithGoogle={onContinueWithGoogle}
        onContinueWithApple={jest.fn()}
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("signIn.continueWithGoogle"),
      }),
    )

    expect(onContinueWithGoogle).toHaveBeenCalledTimes(1)
  })

  it("continues with apple on ios", async () => {
    const onContinueWithApple = jest.fn()
    await renderWithProviders(
      <SocialSignIn
        onContinueWithGoogle={jest.fn()}
        onContinueWithApple={onContinueWithApple}
      />,
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("signIn.continueWithApple"),
      }),
    )

    expect(onContinueWithApple).toHaveBeenCalledTimes(1)
  })
})
