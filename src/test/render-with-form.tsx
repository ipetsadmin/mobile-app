import { type ReactElement, useEffect } from "react"
import {
  type Control,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from "react-hook-form"

import { renderWithProviders } from "./render-with-providers"

type HarnessProps<Values extends FieldValues> = {
  defaultValues: Values
  onForm: (form: UseFormReturn<Values>) => void
  render: (control: Control<Values>) => ReactElement
}

function FormHarness<Values extends FieldValues>({
  defaultValues,
  onForm,
  render,
}: HarnessProps<Values>) {
  const form = useForm<Values>({ defaultValues: defaultValues as never })

  useEffect(() => {
    onForm(form)
  }, [form, onForm])

  return render(form.control)
}

export async function renderWithForm<Values extends FieldValues>(
  defaultValues: Values,
  render: (control: Control<Values>) => ReactElement,
) {
  let current: UseFormReturn<Values> | undefined
  const result = await renderWithProviders(
    <FormHarness
      defaultValues={defaultValues}
      onForm={(form) => {
        current = form
      }}
      render={render}
    />,
  )

  return {
    ...result,
    form: () => current as UseFormReturn<Values>,
  }
}
