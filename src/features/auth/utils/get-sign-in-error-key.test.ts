import { hasTranslationKey } from "@/test/translation-keys"

import { getSignInErrorKey } from "./get-sign-in-error-key"

describe("getSignInErrorKey", () => {
  it("maps 403 to the unverified email message", () => {
    expect(getSignInErrorKey({ status: 403 })).toBe(
      "signIn.errors.emailNotVerified",
    )
  })

  it("maps 401 to the invalid credentials message", () => {
    expect(getSignInErrorKey({ status: 401 })).toBe(
      "signIn.errors.invalidCredentials",
    )
  })

  it.each([
    { status: 500 },
    { status: undefined },
    {},
    null,
    undefined,
    "error",
  ])("falls back to the generic message for %p", (error) => {
    expect(getSignInErrorKey(error)).toBe("signIn.errors.generic")
  })

  it.each([403, 401, 500])("returns a translated key for %i", (status) => {
    expect(hasTranslationKey(getSignInErrorKey({ status }))).toBe(true)
  })
})
