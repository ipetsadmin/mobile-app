export const launchCameraAsync = jest.fn()
export const launchImageLibraryAsync = jest.fn()
export const requestCameraPermissionsAsync = jest.fn()

beforeEach(() => {
  launchCameraAsync.mockReset()
  launchImageLibraryAsync.mockReset()
  requestCameraPermissionsAsync.mockReset()
})
