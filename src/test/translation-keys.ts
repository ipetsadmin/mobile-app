import en from "@/lib/i18n/locales/en.json"
import es from "@/lib/i18n/locales/es.json"

function hasKey(resource: unknown, key: string) {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[part]
          : undefined,
      resource,
    )

  return typeof value === "string"
}

export function hasTranslationKey(key: string) {
  return hasKey(en, key) && hasKey(es, key)
}
