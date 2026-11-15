import { getSchemaIssues } from "@/test/schema-issues"

import { changePasswordSchema } from "./change-password.schema"

const valid = {
  currentPassword: "old-secret",
  newPassword: "12345678",
  confirmPassword: "12345678",
}

describe("changePasswordSchema", () => {
  it("accepts valid values", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true)
  })

  it("requires the current password", () => {
    expect(
      getSchemaIssues(changePasswordSchema, { ...valid, currentPassword: "" }),
    ).toEqual([{ path: "currentPassword", message: "validation.required" }])
  })

  it("rejects a short new password", () => {
    expect(
      getSchemaIssues(changePasswordSchema, {
        ...valid,
        newPassword: "123",
        confirmPassword: "123",
      }),
    ).toEqual([{ path: "newPassword", message: "validation.passwordTooShort" }])
  })

  it("rejects a confirmation that does not match", () => {
    expect(
      getSchemaIssues(changePasswordSchema, {
        ...valid,
        confirmPassword: "nope",
      }),
    ).toEqual([
      { path: "confirmPassword", message: "validation.passwordMismatch" },
    ])
  })
})
