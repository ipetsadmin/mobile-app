import { ApiError } from "./api-error"

describe("ApiError", () => {
  it("keeps the status and the message", () => {
    const error = new ApiError(404, "Not found")

    expect(error.status).toBe(404)
    expect(error.message).toBe("Not found")
  })

  it("is an Error named ApiError", () => {
    const error = new ApiError(500, "Boom")

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.name).toBe("ApiError")
  })
})
