import { hasTranslationKey } from "@/test/translation-keys"

import { getSignUpErrorKey } from "./get-sign-up-error-key"

describe("getSignUpErrorKey", () => {
  it("maps 422 to the email taken message", () => {
    expect(getSignUpErrorKey({ status: 422 })).toBe("signUp.errors.emailTaken")
  })

  it.each([{ status: 500 }, {}, null, undefined])(
    "falls back to the generic message for %p",
    (error) => {
      expect(getSignUpErrorKey(error)).toBe("signUp.errors.generic")
    },
  )

  it.each([422, 500])("returns a translated key for %i", (status) => {
    expect(hasTranslationKey(getSignUpErrorKey({ status }))).toBe(true)
  })
})
