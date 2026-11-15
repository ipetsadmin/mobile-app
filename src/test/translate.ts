import { i18n } from "@/lib/i18n"

export const translate = (key: string, options?: Record<string, unknown>) =>
  i18n.getFixedT("es")(key, options)
