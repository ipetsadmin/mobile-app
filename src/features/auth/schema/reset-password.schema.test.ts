import { getSchemaIssues } from "@/test/schema-issues"

import { resetPasswordSchema } from "./reset-password.schema"

describe("resetPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      resetPasswordSchema.safeParse({ email: "ana@example.com" }).success,
    ).toBe(true)
  })

  it.each(["", "ana", "ana@"])("rejects the email %p", (email) => {
    expect(getSchemaIssues(resetPasswordSchema, { email })).toEqual([
      { path: "email", message: "validation.emailInvalid" },
    ])
  })
})
