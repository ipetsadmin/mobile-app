import {
  clearPendingCredentials,
  getPendingPassword,
  setPendingCredentials,
} from "./pending-credentials"

beforeEach(() => clearPendingCredentials())

describe("pending credentials", () => {
  it("returns nothing before credentials are set", () => {
    expect(getPendingPassword("ana@example.com")).toBeUndefined()
  })

  it("returns the password for the same email", () => {
    setPendingCredentials("ana@example.com", "secret")

    expect(getPendingPassword("ana@example.com")).toBe("secret")
  })

  it("does not return the password for another email", () => {
    setPendingCredentials("ana@example.com", "secret")

    expect(getPendingPassword("other@example.com")).toBeUndefined()
  })

  it("keeps only the latest credentials", () => {
    setPendingCredentials("ana@example.com", "first")
    setPendingCredentials("luis@example.com", "second")

    expect(getPendingPassword("ana@example.com")).toBeUndefined()
    expect(getPendingPassword("luis@example.com")).toBe("second")
  })

  it("forgets the credentials once cleared", () => {
    setPendingCredentials("ana@example.com", "secret")

    clearPendingCredentials()

    expect(getPendingPassword("ana@example.com")).toBeUndefined()
  })
})
