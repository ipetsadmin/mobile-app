import { getSchemaIssues } from "@/test/schema-issues"
import { hasTranslationKey } from "@/test/translation-keys"

import { signInSchema } from "./sign-in.schema"

const valid = { email: "ana@example.com", password: "secret" }

describe("signInSchema", () => {
  it("accepts a valid email and password", () => {
    expect(signInSchema.safeParse(valid).success).toBe(true)
  })

  it.each(["", "ana", "ana@", "@example.com", "ana example.com"])(
    "rejects the email %p",
    (email) => {
      expect(getSchemaIssues(signInSchema, { ...valid, email })).toEqual([
        { path: "email", message: "validation.emailInvalid" },
      ])
    },
  )

  it("requires a password", () => {
    expect(getSchemaIssues(signInSchema, { ...valid, password: "" })).toEqual([
      { path: "password", message: "validation.required" },
    ])
  })

  it("does not impose a minimum password length", () => {
    expect(signInSchema.safeParse({ ...valid, password: "a" }).success).toBe(
      true,
    )
  })

  it("reports translated messages", () => {
    const issues = getSchemaIssues(signInSchema, { email: "", password: "" })

    expect(issues).toHaveLength(2)
    expect(issues.filter((issue) => !hasTranslationKey(issue.message))).toEqual(
      [],
    )
  })
})
