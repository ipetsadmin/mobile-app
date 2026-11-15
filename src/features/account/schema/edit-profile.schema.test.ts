import { getSchemaIssues } from "@/test/schema-issues"

import { editProfileSchema } from "./edit-profile.schema"

const valid = { firstName: "Ana", lastName: "Gomez" }

describe("editProfileSchema", () => {
  it("accepts names without a photo", () => {
    expect(editProfileSchema.safeParse(valid).success).toBe(true)
  })

  it("accepts a photo uri", () => {
    expect(
      editProfileSchema.safeParse({ ...valid, photoUri: "file:///photo.jpg" })
        .success,
    ).toBe(true)
  })

  it.each(["firstName", "lastName"] as const)("requires %s", (field) => {
    expect(
      getSchemaIssues(editProfileSchema, { ...valid, [field]: "  " }),
    ).toEqual([{ path: field, message: "validation.required" }])
  })

  it("trims the names", () => {
    const result = editProfileSchema.parse({
      firstName: "  Ana ",
      lastName: " Gomez  ",
    })

    expect(result).toEqual({ firstName: "Ana", lastName: "Gomez" })
  })
})
