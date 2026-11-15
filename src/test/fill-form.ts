import type { Control, FieldValues, Path } from "react-hook-form"

export async function fillField<Values extends FieldValues>(
  control: Control<Values>,
  name: Path<Values>,
  value: unknown,
) {
  await control.register(name).onChange({
    target: { name, value },
    type: "change",
  })
}

export async function fillForm<Values extends FieldValues>(
  control: Control<Values>,
  values: Partial<Record<Path<Values>, unknown>>,
) {
  for (const [name, value] of Object.entries(values)) {
    await fillField(control, name as Path<Values>, value)
  }
}
