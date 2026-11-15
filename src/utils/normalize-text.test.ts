import { normalizeText } from "./normalize-text"

describe("normalizeText", () => {
  it("removes diacritics", () => {
    expect(normalizeText("Pastor Alemán")).toBe("pastor aleman")
  })

  it("lowercases and trims", () => {
    expect(normalizeText("  LABRADOR  ")).toBe("labrador")
  })

  it("keeps the letter ñ readable without its tilde", () => {
    expect(normalizeText("Español")).toBe("espanol")
  })

  it("returns an empty string for blank input", () => {
    expect(normalizeText("   ")).toBe("")
  })
})
