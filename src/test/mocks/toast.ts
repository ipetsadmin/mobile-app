export const Toaster = () => null

export const toast = {
  success: jest.fn(),
  error: jest.fn(),
}

beforeEach(() => {
  toast.success.mockReset()
  toast.error.mockReset()
})
