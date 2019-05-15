declare global {
  interface Window {
    web3: any
    ethereum: any
  }
}

export interface BalanceStoreTypes {
  ethBalance: string
  wethBalance: string
  ethPrice: string
  wethPrice: string
  error: string
  standardGasPrice: string
  transactionStatus: string
  getBalance: (publicAddress: string) => void
  clearData: () => string
  setError: (err: string) => string
  wrapEth: (value: string) => void
  unwrapWeth: (value: string) => void
  setTransactionStatus: (value: BalanceStoreTypes['transactionStatus']) => void
}
