import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import {
  clearPendingCredentials,
  getPendingPassword,
} from "../utils/pending-credentials"
import { useSignUpForm } from "./use-sign-up-form"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("sonner-native", () => jest.requireActual("@/test/mocks/toast"))

beforeEach(clearPendingCredentials)

const values = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana@example.com",
  password: "12345678",
}

async function setup() {
  const onSignedUp = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useSignUpForm({ onSignedUp }),
  )

  return { ...hook, onSignedUp }
}

describe("useSignUpForm", () => {
  it("does not call the API while the form is invalid", async () => {
    const { result } = await setup()

    await act(async () => {
      await result.current.submit()
    })

    expect(authClient.signUp.email).not.toHaveBeenCalled()
  })

  it("registers, remembers the credentials and moves on with the trimmed email", async () => {
    authClient.signUp.email.mockResolvedValue({ data: {}, error: null })
    const { result, onSignedUp } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(authClient.signUp.email).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ana@example.com", name: "Ana Gomez" }),
    )
    expect(onSignedUp).toHaveBeenCalledWith("ana@example.com")
    expect(getPendingPassword("ana@example.com")).toBe("12345678")
  })

  it("tells the user the email is already taken on 422", async () => {
    authClient.signUp.email.mockResolvedValue({
      data: null,
      error: { status: 422 },
    })
    const { result, onSignedUp } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("signUp.errors.emailTaken"),
    )
    expect(onSignedUp).not.toHaveBeenCalled()
    expect(getPendingPassword("ana@example.com")).toBeUndefined()
  })

  it("shows the generic message for any other error", async () => {
    authClient.signUp.email.mockResolvedValue({
      data: null,
      error: { status: 500 },
    })
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("signUp.errors.generic"))
  })
})
