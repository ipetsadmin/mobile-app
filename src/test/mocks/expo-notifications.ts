export const AndroidImportance = { DEFAULT: 3 }

export const getPermissionsAsync = jest.fn()
export const requestPermissionsAsync = jest.fn()
export const setNotificationChannelAsync = jest.fn()

export const granted = { granted: true, canAskAgain: true }
export const denied = { granted: false, canAskAgain: false }
export const undetermined = { granted: false, canAskAgain: true }

beforeEach(() => {
  getPermissionsAsync.mockReset().mockResolvedValue(undetermined)
  requestPermissionsAsync.mockReset()
  setNotificationChannelAsync.mockReset()
})
