import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import debounce from 'lodash/debounce'
import { isServer } from '../../utils/isServer'
import { apiCaller } from '../../utils/apiCaller'
import { ETHPRICE_API_URL, ETHPRICE_KEY } from '../../config/api'
import { WETH_ADDRESS } from '../../config/metamask'
import { BalanceStoreTypes } from './types'
import { bind } from '../../utils/bind'

useStaticRendering(isServer)

class BalanceStore {
  @observable web3 = null
  @observable ethBalance = null
  @observable wethBalance = null
  @observable ethPrice = null
  @observable wethPrice = null
  @observable error = ''
  @observable transactionStatus = ''

  wethAddress = WETH_ADDRESS

  constructor({}, initialState: BalanceStoreTypes) {
    this.ethBalance = initialState ? initialState.ethBalance : null
    this.wethBalance = initialState ? initialState.wethBalance : null
    this.ethPrice = initialState ? initialState.ethPrice : null
    this.wethPrice = initialState ? initialState.wethPrice : null
    this.error = initialState ? initialState.error : ''
    this.transactionStatus = initialState ? initialState.transactionStatus : ''

    if (!isServer) {
      this.web3 = window.web3 as Window
    }
  }

  @bind
  @action
  public getBalance(publicAddress) {
    if (publicAddress) {
      this.web3.eth.getBalance(
        publicAddress,
        (err: string, balance: number) => {
          if (!err) {
            this.ethBalance = this.web3.fromWei(balance, 'ether') + ''
          } else {
            this.error === err
          }
        }
      )

      const abiBalance = [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          type: 'function'
        }
      ]

      const wethToken = this.web3.eth.contract(abiBalance).at(this.wethAddress)
      wethToken.balanceOf.call(
        publicAddress,
        debounce(async (err: string, balance: number) => {
          if (!err) {
            this.wethBalance = this.web3.fromWei(balance, 'ether') + ''
            let price: number
            if (!price) {
              const {
                result: { ethusd }
              } = await apiCaller(
                `${ETHPRICE_API_URL}api?module=stats&action=ethprice&apikey=${ETHPRICE_KEY}`
              )
              price = +ethusd
            }

            this.ethPrice = this.ethBalance * +price
            this.wethPrice = this.wethBalance * +price
          } else {
            this.error === err
          }
        }, 1000)
      )
    }
  }

  @bind
  @action
  public setError(error: BalanceStoreTypes['error']) {
    this.error = error
  }

  @bind
  @action
  public clearData() {
    this.ethBalance = null
    this.ethPrice = null
    this.wethBalance = null
    this.wethPrice = null
    this.error = ''
    this.transactionStatus = ''
  }

  @bind
  @action
  public wrapEth(value: string) {
    if (value) {
      const wethAmount = new window.web3.BigNumber(value) // ETH to WETH
      this.setTransactionStatus('wrapRequested')
      this.web3.eth
        .contract([
          {
            constant: false,
            inputs: [],
            name: 'deposit',
            outputs: [],
            payable: true,
            stateMutability: 'payable',
            type: 'function'
          }
        ])
        .at(this.wethAddress)
        .deposit(
          {
            value: wethAmount.mul(new window.web3.BigNumber(10).pow(18)) // Convert to WEI
          },
          (err: { message: string }, transactionHash: string) => {
            this.setTransactionStatus('wrapPending')
            if (!err) {
              this.web3.eth.filter(
                {},
                (error: string, result: { transactionHash: string }) => {
                  this.web3.eth.getTransactionReceipt(
                    transactionHash,
                    (err: string, res: { status: string }) => {
                      if (error || err) {
                        this.setError(error || err)
                      }
                      if (transactionHash === result.transactionHash) {
                        this.setTransactionStatus('wrapSuccess')
                      } else if (res && res.status === '0x0') {
                        this.setTransactionStatus('wrapError')
                      }
                    }
                  )
                }
              )
            } else {
              this.setTransactionStatus('wrapCanceled')
              this.setError(err.message)
            }
          }
        )
    }
  }

  @bind
  @action
  public unwrapWeth(value: string) {
    if (value) {
      const wethAmount = new window.web3.BigNumber(value) // ETH to WETH
      this.setTransactionStatus('unwrapRequested')
      window.web3.eth
        .contract([
          {
            constant: false,
            inputs: [
              {
                name: 'wad',
                type: 'uint256'
              }
            ],
            name: 'withdraw',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ])
        .at(this.wethAddress)
        .withdraw(
          wethAmount.mul(new window.web3.BigNumber(10).pow(18)), // Convert to WEI
          (err: { message: string }, transactionHash: string) => {
            this.setTransactionStatus('unwrapPending')
            if (!err) {
              this.web3.eth.filter(
                {},
                (error: string, result: { transactionHash: string }) => {
                  this.web3.eth.getTransactionReceipt(
                    transactionHash,
                    (err: string, res: { status: string }) => {
                      if (error || err) {
                        this.setError(error || err)
                      }
                      if (transactionHash === result.transactionHash) {
                        this.setTransactionStatus('unwrapSuccess')
                      } else if (res && res.status === '0x0') {
                        this.setTransactionStatus('unwrapError')
                      }
                    }
                  )
                }
              )
            } else {
              this.setTransactionStatus('unwrapCanceled')
              this.setError(err.message)
            }
          }
        )
    }
  }

  @bind
  @action
  public setTransactionStatus(value: BalanceStoreTypes['transactionStatus']) {
    this.transactionStatus = value
  }
}

export const initBalanceStore = (initialState?: any) => {
  return new BalanceStore(isServer, initialState)
}
