import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import { PasswordField } from "./password-field"

async function setup() {
  return renderWithForm({ password: "" }, (control) => (
    <PasswordField control={control} name="password" label="Password" />
  ))
}

describe("PasswordField", () => {
  it("hides the password by default", async () => {
    await setup()

    expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(true)
    expect(
      screen.getByRole("button", { name: translate("common.showPassword") }),
    ).toBeOnTheScreen()
  })

  it("shows and hides the password with the toggle", async () => {
    await setup()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.showPassword") }),
    )

    expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(false)
    expect(
      screen.getByRole("button", { name: translate("common.hidePassword") }),
    ).toBeOnTheScreen()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.hidePassword") }),
    )

    expect(screen.getByLabelText("Password").props.secureTextEntry).toBe(true)
  })

  it("writes the typed password into the form", async () => {
    const { form } = await setup()

    await fireEvent.changeText(screen.getByLabelText("Password"), "secret")

    expect(form().getValues("password")).toBe("secret")
  })
})
