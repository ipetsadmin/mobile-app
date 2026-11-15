import { notifyManager } from "@tanstack/react-query"

import { resetSession } from "@/test/mocks/session"

notifyManager.setScheduler((callback) => callback())

afterEach(resetSession)

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}))

jest.mock("@react-native-async-storage/async-storage", () =>
  jest.requireActual(
    "@react-native-async-storage/async-storage/jest/async-storage-mock",
  ),
)

jest.mock("@expo/ui", () => jest.requireActual("@/test/mocks/expo-ui"))

jest.mock("react-native-keyboard-controller", () =>
  jest.requireActual("react-native-keyboard-controller/jest"),
)

jest.mock("react-native-worklets", () =>
  jest.requireActual("react-native-worklets/src/mock"),
)

jest.mock("react-native-reanimated", () =>
  jest.requireActual("react-native-reanimated/mock"),
)
