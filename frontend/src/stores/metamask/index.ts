import { observable, action } from 'mobx'
import debounce from 'lodash/debounce'
import { isServer } from '../../utils/isServer'
import { WETH_ADDRESS } from '../../config/metamask'
import { MetamaskStoreTypes } from './types'
import { bind } from '../../utils/bind'

class MetamaskStore {
  @observable web3 = null
  @observable publicAddress = ''
  @observable loading = false
  @observable metamaskStatus = null

  wethAddress = WETH_ADDRESS

  public constructor(initialState?: MetamaskStoreTypes) {
    this.publicAddress = initialState ? initialState.publicAddress : ''

    if (!isServer) {
      this.web3 = window.web3 as Window
    }
  }

  @action private checkMetamaskUpdate = debounce(
    () => {
      this.loading = true
      this.web3.eth.getAccounts((err: string, accounts: string[]) => {
        if (err) {
          this.metamaskStatus = 'error'
          this.loading = false
        } else if (accounts.length === 0) {
          this.metamaskStatus = 'logged out'
          this.loading = false
          this.publicAddress = null
        } else {
          this.metamaskStatus = 'logged in'
          this.loading = false
          if (!this.publicAddress) {
            this.publicAddress = accounts[0]
          } else if (this.publicAddress !== accounts[0]) {
            this.metamaskStatus = 'account changed'
            this.publicAddress = accounts[0]
          }
        }
      })
    },
    500,
    { maxWait: 2000 }
  )

  @bind
  @action
  public async checkMetamask() {
    const provider = this.web3.currentProvider
    if (provider.isMetaMask) {
      let accounts = provider.enable
        ? await provider.enable()
        : provider.selectedAddress

      this.checkMetamaskUpdate()
      provider.publicConfigStore.on('update', () => {
        this.checkMetamaskUpdate()
      })
      if (!accounts) {
        // PLEASE SIGNIN TO METAMASK
      } else if (provider.networkVersion !== '3') {
        // 1 - PROD; 3 - DEV (ROPSTEN)
        // PLEASE SWITCH TO ROPSTEN
      } else {
        this.checkMetamaskUpdate()
        provider.publicConfigStore.on('update', () => {
          this.checkMetamaskUpdate()
        })
      }
    }
  }
}

export const initMetamaskStore = () => {
  return new MetamaskStore()
}
