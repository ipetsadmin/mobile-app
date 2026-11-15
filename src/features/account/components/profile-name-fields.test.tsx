import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithForm } from "@/test/render-with-form"
import { translate } from "@/test/translate"

import type { EditProfileValues } from "../schema/edit-profile.schema"
import { ProfileNameFields } from "./profile-name-fields"

const defaults: EditProfileValues = { firstName: "Ana", lastName: "Gomez" }

async function setup(onFocusLastName = jest.fn(), onSubmit = jest.fn()) {
  const view = await renderWithForm(defaults, (control) => (
    <ProfileNameFields
      control={control}
      onFocusLastName={onFocusLastName}
      onSubmit={onSubmit}
    />
  ))

  return { ...view, onFocusLastName, onSubmit }
}

describe("ProfileNameFields", () => {
  it("shows both names", async () => {
    await setup()

    expect(
      screen.getByLabelText(translate("account.profile.firstName")),
    ).toHaveDisplayValue("Ana")
    expect(
      screen.getByLabelText(translate("account.profile.lastName")),
    ).toHaveDisplayValue("Gomez")
  })

  it("writes the typed names into the form", async () => {
    const { form } = await setup()

    await fireEvent.changeText(
      screen.getByLabelText(translate("account.profile.firstName")),
      "Luisa",
    )
    await fireEvent.changeText(
      screen.getByLabelText(translate("account.profile.lastName")),
      "Perez",
    )

    expect(form().getValues()).toMatchObject({
      firstName: "Luisa",
      lastName: "Perez",
    })
  })

  it("moves to the last name when submitting the first name", async () => {
    const { onFocusLastName, onSubmit } = await setup()

    await fireEvent(
      screen.getByLabelText(translate("account.profile.firstName")),
      "submitEditing",
    )

    expect(onFocusLastName).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits the form from the last name", async () => {
    const { onFocusLastName, onSubmit } = await setup()

    await fireEvent(
      screen.getByLabelText(translate("account.profile.lastName")),
      "submitEditing",
    )

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onFocusLastName).not.toHaveBeenCalled()
  })
})
