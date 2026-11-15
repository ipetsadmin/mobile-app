import { ApiError } from "./api-error"
import { queryClient } from "./query-client"

type RetryFunction = (failureCount: number, error: Error) => boolean

const queryOptions = queryClient.getDefaultOptions().queries
const shouldRetry = queryOptions?.retry as RetryFunction

describe("queryClient defaults", () => {
  it("never retries an unauthorized request", () => {
    expect(shouldRetry(0, new ApiError(401, "Unauthorized"))).toBe(false)
  })

  it("retries other errors up to two times", () => {
    const error = new ApiError(500, "Server error")

    expect(shouldRetry(0, error)).toBe(true)
    expect(shouldRetry(1, error)).toBe(true)
    expect(shouldRetry(2, error)).toBe(false)
  })

  it("retries generic errors", () => {
    expect(shouldRetry(0, new Error("Network"))).toBe(true)
  })

  it("keeps data fresh for one minute", () => {
    expect(queryOptions?.staleTime).toBe(60_000)
  })

  it("does not retry mutations", () => {
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(0)
  })
})
