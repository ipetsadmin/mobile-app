export const apiClient = {
  auth: {
    verifyEmail: jest.fn(),
    sendVerificationOtp: jest.fn(),
  },
  users: {
    getProfile: jest.fn(),
    getAgenda: jest.fn(),
    getPets: jest.fn(),
    createPet: jest.fn(),
    patchProfile: jest.fn(),
    patchPreferences: jest.fn(),
    prepareAvatarUpload: jest.fn(),
    confirmAvatarUpload: jest.fn(),
  },
  pets: {
    getById: jest.fn(),
    update: jest.fn(),
    getTreatments: jest.fn(),
    createTreatment: jest.fn(),
    getAppointments: jest.fn(),
    createAppointment: jest.fn(),
    preparePhotoUpload: jest.fn(),
    confirmPhotoUpload: jest.fn(),
  },
}

export const TEST_COOKIE = "session-cookie"

export const getSessionCookie = async () => TEST_COOKIE

export const ok = <Data>(data: Data) => ({ success: true, data })

beforeEach(() => {
  for (const group of Object.values(apiClient)) {
    for (const endpoint of Object.values(group)) endpoint.mockReset()
  }
})
