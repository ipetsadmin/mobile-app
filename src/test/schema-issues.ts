import type { ZodType } from "zod"

export type SchemaIssue = {
  path: string
  message: string
}

export function getSchemaIssues(
  schema: ZodType,
  value: unknown,
): SchemaIssue[] {
  const result = schema.safeParse(value)

  if (result.success) return []

  return result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }))
}
