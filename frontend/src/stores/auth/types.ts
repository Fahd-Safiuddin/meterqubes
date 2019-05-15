export interface AuthStoreTypes {
  error: string | []
  authRequested: boolean
  getToken: (publicAddress: string, nonce: string) => void
  createUser: (publicAddress: string) => void
  authUser: (publicAddress: string) => void
}
