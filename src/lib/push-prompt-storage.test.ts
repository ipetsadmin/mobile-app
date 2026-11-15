import AsyncStorage from "@react-native-async-storage/async-storage"

import {
  hasAnsweredPushPrompt,
  markPushPromptAnswered,
} from "./push-prompt-storage"

beforeEach(() => AsyncStorage.clear())

describe("push prompt storage", () => {
  it("has not been answered at first", async () => {
    expect(await hasAnsweredPushPrompt()).toBe(false)
  })

  it("remembers that the prompt was answered", async () => {
    await markPushPromptAnswered()

    expect(await hasAnsweredPushPrompt()).toBe(true)
  })
})
