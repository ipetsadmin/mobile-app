import { getSchemaIssues } from "@/test/schema-issues"
import { hasTranslationKey } from "@/test/translation-keys"

import { signUpSchema } from "./sign-up.schema"

const valid = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana@example.com",
  password: "12345678",
}

describe("signUpSchema", () => {
  it("accepts valid values", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it.each(["firstName", "lastName"] as const)("requires %s", (field) => {
    expect(getSchemaIssues(signUpSchema, { ...valid, [field]: "" })).toEqual([
      { path: field, message: "validation.required" },
    ])
  })

  it.each(["firstName", "lastName"] as const)(
    "rejects a %s with only spaces",
    (field) => {
      expect(
        getSchemaIssues(signUpSchema, { ...valid, [field]: "   " }),
      ).toEqual([{ path: field, message: "validation.required" }])
    },
  )

  it("rejects an invalid email", () => {
    expect(getSchemaIssues(signUpSchema, { ...valid, email: "ana" })).toEqual([
      { path: "email", message: "validation.emailInvalid" },
    ])
  })

  it("requires at least 8 characters in the password", () => {
    expect(
      getSchemaIssues(signUpSchema, { ...valid, password: "1234567" }),
    ).toEqual([{ path: "password", message: "validation.passwordTooShort" }])
    expect(
      signUpSchema.safeParse({ ...valid, password: "12345678" }).success,
    ).toBe(true)
  })

  it("reports translated messages", () => {
    const issues = getSchemaIssues(signUpSchema, {
      firstName: "",
      lastName: "",
      email: "x",
      password: "1",
    })

    expect(issues).toHaveLength(4)
    expect(issues.filter((issue) => !hasTranslationKey(issue.message))).toEqual(
      [],
    )
  })
})
