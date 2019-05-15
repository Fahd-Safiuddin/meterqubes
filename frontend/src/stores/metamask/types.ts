declare global {
  interface Window {
    web3: any
    ethereum: any
  }
}

export interface MetamaskStoreTypes {
  publicAddress: string | null
  metamaskStatus: string
  loading: boolean
  checkMetamask: () => void
  checkMetamaskUpdate: () => void
}
