import { getSchemaIssues } from "@/test/schema-issues"

import { CODE_LENGTH, verifyAccountSchema } from "./verify-account.schema"

describe("verifyAccountSchema", () => {
  it("expects a six digit code", () => {
    expect(CODE_LENGTH).toBe(6)
  })

  it("accepts a code with the expected length", () => {
    expect(verifyAccountSchema.safeParse({ code: "123456" }).success).toBe(true)
  })

  it.each(["", "12345", "1234567"])("rejects the code %p", (code) => {
    expect(getSchemaIssues(verifyAccountSchema, { code })).toEqual([
      { path: "code", message: "validation.codeInvalid" },
    ])
  })
})
