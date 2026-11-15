import { authClient } from "@/test/mocks/auth-client"
import { apiClient } from "./api-client"
import { ApiError } from "./api-error"
import { queryClient } from "./query-client"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("@/lib/query-client", () => ({
  queryClient: { clear: jest.fn() },
}))

const fetchMock = jest.fn()

function respond(status: number, body?: unknown) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: `status ${status}`,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
  })
}

beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = "https://api.test"
  global.fetch = fetchMock
  fetchMock.mockReset()
  authClient.signOut.mockResolvedValue({ error: null })
})

describe("successful requests", () => {
  it("calls the API base url with the session cookie and json headers", async () => {
    respond(200, { success: true, data: {} })

    await apiClient.users.getProfile("session-cookie")

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toMatch(/^https:\/\/api\.test\/.*\/me\/profile$/)
    expect(init.method).toBe("GET")
    expect(init.credentials).toBe("omit")
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Cookie: "session-cookie",
    })
  })

  it("returns the parsed body as data", async () => {
    respond(200, { success: true, data: { id: "user-1" } })

    const response = await apiClient.users.getProfile("session-cookie")

    expect(response).toEqual({ success: true, data: { id: "user-1" } })
  })

  it("accepts an empty response body", async () => {
    respond(204)

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).resolves.toBeUndefined()
  })

  it("sends the body of a post as json", async () => {
    respond(201, { success: true })

    await apiClient.users.patchPreferences("session-cookie", {
      notifications: { push: true, email: false },
    })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe("PATCH")
    expect(JSON.parse(init.body)).toEqual({
      notifications: { push: true, email: false },
    })
  })
})

describe("failed requests", () => {
  it("throws an ApiError with the status and the API message", async () => {
    respond(400, { message: "Bad data" })

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Bad data",
    })
  })

  it("uses the status text when the API sends no message", async () => {
    respond(500)

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).rejects.toMatchObject({
      status: 500,
      message: "status 500",
    })
  })

  it("rethrows network errors untouched", async () => {
    const error = new TypeError("Network request failed")
    fetchMock.mockRejectedValue(error)

    await expect(apiClient.users.getProfile("session-cookie")).rejects.toBe(
      error,
    )
  })
})

describe("unauthorized responses", () => {
  it("ends the session when an authenticated request returns 401", async () => {
    respond(401, { message: "Unauthorized" })

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).rejects.toBeInstanceOf(ApiError)

    expect(authClient.signOut).toHaveBeenCalledTimes(1)
    expect(queryClient.clear).toHaveBeenCalledTimes(1)
  })

  it("clears the cache even when signing out fails", async () => {
    authClient.signOut.mockRejectedValue(new Error("offline"))
    respond(401)

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).rejects.toBeDefined()

    expect(queryClient.clear).toHaveBeenCalledTimes(1)
  })

  it("does not end the session for other errors", async () => {
    respond(403, { message: "Forbidden" })

    await expect(
      apiClient.users.getProfile("session-cookie"),
    ).rejects.toBeDefined()

    expect(authClient.signOut).not.toHaveBeenCalled()
  })
})

describe("timeouts", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("aborts after 20 seconds and throws a timeout ApiError", async () => {
    fetchMock.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () =>
            reject(new Error("aborted")),
          )
        }),
    )

    const request = apiClient.users.getProfile("session-cookie")
    const assertion = expect(request).rejects.toMatchObject({
      status: 0,
      message: "REQUEST_TIMEOUT",
    })

    await jest.advanceTimersByTimeAsync(20_000)
    await assertion
  })
})
