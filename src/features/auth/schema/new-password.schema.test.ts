import { getSchemaIssues } from "@/test/schema-issues"

import { newPasswordSchema } from "./new-password.schema"

const valid = { newPassword: "12345678", confirmPassword: "12345678" }

describe("newPasswordSchema", () => {
  it("accepts matching passwords of enough length", () => {
    expect(newPasswordSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects a short password", () => {
    expect(
      getSchemaIssues(newPasswordSchema, {
        newPassword: "1234567",
        confirmPassword: "1234567",
      }),
    ).toEqual([{ path: "newPassword", message: "validation.passwordTooShort" }])
  })

  it("requires the confirmation", () => {
    expect(
      getSchemaIssues(newPasswordSchema, { ...valid, confirmPassword: "" }),
    ).toContainEqual({
      path: "confirmPassword",
      message: "validation.required",
    })
  })

  it("rejects passwords that do not match", () => {
    expect(
      getSchemaIssues(newPasswordSchema, {
        ...valid,
        confirmPassword: "87654321",
      }),
    ).toEqual([
      { path: "confirmPassword", message: "validation.passwordMismatch" },
    ])
  })
})
