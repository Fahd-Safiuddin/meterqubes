import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import crypto from 'crypto'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import { keccak256, fromRpcSig } from 'ethereumjs-util'
import { isServer } from '../../utils/isServer'
import { OrdersStoreTypes, SignOrderTypes } from './types'
import { apiCaller } from '../../utils/apiCaller'
import { GASPRICE_API_URL, API_URL } from '../../config/api'
import { bind } from '../../utils/bind'

useStaticRendering(isServer)

class OdersStore {
  @observable ordersList = []
  @observable orderStatus = null
  @observable error = null
  @observable relayer = null
  @observable orderBook = null

  constructor({}, initialState: OrdersStoreTypes) {
    this.ordersList = initialState ? initialState.ordersList : []
    this.error = initialState ? initialState.error : null
    this.relayer = initialState ? initialState.relayer : null
    this.orderBook = initialState ? initialState.orderBook : null
  }

  @bind
  @action
  public async getOrders(marketId: number | string) {
    const res = await apiCaller(`${API_URL}/orders/user/${marketId}`)
    const { relayer } = await apiCaller(`${API_URL}/data/relayer/`)

    if (res) {
      this.ordersList = res.map(
        ({
          market,
          side,
          price,
          amount,
          availabelAmount,
          confirmedAmount,
          createdAt
        }) => ({
          pair: market.tokens,
          type: side,
          price,
          amount,
          availabelAmount,
          confirmedAmount,
          createdAt: moment(createdAt).format('DD/MM/YYYY HH:mm')
        })
      )
    }

    if (relayer) {
      this.relayer = relayer
    }
  }

  @bind
  @action
  public setError(error: OrdersStoreTypes['error']) {
    this.error = error
  }

  @bind
  @action
  public setOrderStatus(status: OrdersStoreTypes['orderStatus']) {
    this.orderStatus = status
  }

  @bind
  @action
  public setOrders(orders: OrdersStoreTypes['ordersList']) {
    this.ordersList = orders
  }

  @bind
  @action
  public async getOrderBook(marketId: number = 1) {
    const res = await apiCaller(`${API_URL}/order-book/history/${marketId}`)
    const data = {
      ...res,
      SELL: res.SELL.map(({ price, amount }) => ({
        price,
        amount,
        total: price * amount
      })),
      BUY: res.BUY.map(({ price, amount }) => ({
        price,
        amount,
        total: price * amount
      }))
    }
    if (res) this.orderBook = data
  }

  @bind
  @action
  public addOrderBook(orderBook: OrdersStoreTypes['orderBook']) {
    if (+this.orderBook.marketId === orderBook.marketId) {
      this.orderBook.SELL = sortBy(
        [...this.orderBook.SELL, ...orderBook.SELL],
        ({ price }) => price
      ).reverse()

      this.orderBook.BUY = sortBy(
        [...this.orderBook.BUY, ...orderBook.BUY],
        ({ price }) => price
      ).reverse()
    }
  }

  @bind
  @action
  public async createOrder(
    price: number,
    amount: number,
    tokens: string,
    baseToken: string,
    quoteToken: string,
    isSell: boolean
  ) {
    if (!isServer && window.web3 !== 'undefined') {
      const w3 = window.web3
      const publicAddress = w3.eth.coinbase
      const gasPrice = await apiCaller(GASPRICE_API_URL)

      if (gasPrice) {
        this.setError(null)
        this.setOrderStatus('pending')
        const sha3ToHex = (message: string) => {
          return '0x' + keccak256(message).toString('hex')
        }

        const EIP712_DOMAIN_TYPEHASH = sha3ToHex('EIP712Domain(string name)')

        const EIP712_ORDER_TYPE = sha3ToHex(
          'Order(address trader,address relayer,address baseToken,address quoteToken,uint256 baseTokenAmount,uint256 quoteTokenAmount,uint256 gasTokenAmount,bytes32 data)'
        )

        const generateOrderData = (order: SignOrderTypes) => {
          const {
            version,
            isSell,
            isMarket,
            expiredAtSeconds,
            asMakerFeeRate,
            asTakerFeeRate,
            makerRebateRate,
            salt
          } = order

          let res = '0x'
          res += addLeadingZero(new BigNumber(version).toString(16), 2)
          res += isSell ? '01' : '00'
          res += isMarket ? '01' : '00'
          res += addLeadingZero(
            new BigNumber(expiredAtSeconds).toString(16),
            5 * 2
          )
          res += addLeadingZero(
            new BigNumber(asMakerFeeRate).toString(16),
            2 * 2
          )
          res += addLeadingZero(
            new BigNumber(asTakerFeeRate).toString(16),
            2 * 2
          )
          res += addLeadingZero(
            new BigNumber(makerRebateRate).toString(16),
            2 * 2
          )
          res += addLeadingZero(new BigNumber(salt).toString(16), 8 * 2)

          return addTailingZero(res, 66)
        }

        function addLeadingZero(str: string, length: number) {
          let len = str.length
          return '0'.repeat(length - len) + str
        }

        function addTailingZero(str: string, length: number) {
          let len = str.length
          return str + '0'.repeat(length - len)
        }

        const getOrderHash = (order: SignOrderTypes) => {
          return getEIP712MessageHash(
            sha3ToHex(
              EIP712_ORDER_TYPE +
                addLeadingZero(order.trader.slice(2), 64) +
                addLeadingZero(order.relayer.slice(2), 64) +
                addLeadingZero(order.baseToken.slice(2), 64) +
                addLeadingZero(order.quoteToken.slice(2), 64) +
                addLeadingZero(
                  new BigNumber(order.baseTokenAmount).toString(16),
                  64
                ) +
                addLeadingZero(
                  new BigNumber(order.quoteTokenAmount).toString(16),
                  64
                ) +
                addLeadingZero(
                  new BigNumber(order.gasTokenAmount).toString(16),
                  64
                ) +
                order.data.slice(2)
            )
          )
        }

        function getEIP712MessageHash(message) {
          return sha3ToHex(
            '0x1901' + getDomainSeparator().slice(2) + message.slice(2)
          )
        }

        function getDomainSeparator() {
          return sha3ToHex(
            EIP712_DOMAIN_TYPEHASH + sha3ToHex('Hydro Protocol').slice(2)
          )
        }

        // ************************

        const relayer = this.relayer
        const contractGas = 190000
        const baseDecimals = 18 // get decimals from token smart contract
        const quoteDecimals = 18 // get decimals from token smart contract

        // NEED TO QUERY standard GAS PRICE FROM https://www.etherchain.org/api/gasPriceOracle
        const expiresAt = new Date()
        const baseTokenAmount = amount * Math.pow(10, baseDecimals)

        const takerAmount = baseTokenAmount / Math.pow(10, baseDecimals)

        const getGasAmount = (
          gasPrice: number,
          baseDecimals: number,
          takerAmount: number
        ) => {
          /**
           *
           * @param gasPrice - for test orders = 10
           * @param baseDecimals - from market, for test = 18
           * @param takerAmount = taker order amount or takerAmount = baseTokenAmount / Math.pow(10, baseDecimals),
           * @returns {string}
           */
          return new BigNumber(gasPrice / Math.pow(10, 9))
            .multipliedBy(new BigNumber(contractGas))
            .multipliedBy(new BigNumber(Math.pow(10, baseDecimals))) // Gwei to Wei
            .multipliedBy(new BigNumber(takerAmount))
            .toFixed(0)
        }

        const gasTokenAmount = Number(
          getGasAmount(gasPrice.standard, 18, takerAmount)
        )

        const quoteTokenAmount = Number(
          new BigNumber(amount)
            .multipliedBy(new BigNumber(price))
            .multipliedBy(new BigNumber(Math.pow(10, quoteDecimals)))
        )

        const traderOrder = {
          version: 2, // uint256 public constant SUPPORTED_ORDER_VERSION = 2
          trader: publicAddress,
          relayer,
          baseToken,
          quoteToken,
          baseTokenAmount,
          quoteTokenAmount,
          gasTokenAmount,
          isSell: isSell, // buy or sell
          isMarket: false,
          expiredAtSeconds: Math.floor(
            expiresAt.setMonth(expiresAt.getMonth() + 2) / 1000
          ),
          asMakerFeeRate: 100, // uint256 public constant FEE_RATE_BASE = 100000
          asTakerFeeRate: 300, // uint256 public constant FEE_RATE_BASE = 100000
          makerRebateRate: 0, // uint256 public constant REBATE_RATE_BASE = 100
          salt: parseInt(crypto.randomBytes(6).toString('hex'), 16),
          data: null
        }

        traderOrder.data = generateOrderData(traderOrder)

        const traderOrderHash = getOrderHash(traderOrder)

        w3.personal.sign(
          w3.toHex(traderOrderHash),
          w3.eth.coinbase,
          (
            err: { code: number | string; message: string },
            signature: string
          ) => {
            this.setOrderStatus(null)
            if (err) {
              this.setOrderStatus('canceled')
              this.setError(err.message)
              return
            }

            function padToBytes32(n: string) {
              while (n.length < 64) n += '0'
              return '0x' + n
            }

            const traderOrderSigVRS = fromRpcSig(signature)
            let traderOrderSigConfig =
              Number(traderOrderSigVRS.v).toString(16) + '00'
            traderOrderSigConfig = padToBytes32(traderOrderSigConfig)
            const _traderOrderSig = {
              config: traderOrderSigConfig,
              r: '0x' + traderOrderSigVRS.r.toString('hex'),
              s: '0x' + traderOrderSigVRS.s.toString('hex')
            }

            // **********************************************
            // SUBMIT TO /orders/
            const traderOrderParam = {
              trader: traderOrder.trader,
              baseTokenAmount: Math.floor(traderOrder.baseTokenAmount),
              quoteTokenAmount: Math.floor(traderOrder.quoteTokenAmount),
              gasTokenAmount: Math.floor(traderOrder.gasTokenAmount),
              data: traderOrder.data,
              tokens: tokens,
              signature: _traderOrderSig
            }

            if (traderOrderParam) {
              apiCaller(`${API_URL}/orders`, 'POST', traderOrderParam)
                .then(res => {
                  if (res) {
                    this.setOrderStatus('success')
                  }
                })
                .catch(({ response: { data: { message, error } } }) => {
                  if (message || error) {
                    this.setError(message || error)
                    this.setOrderStatus('submitError')
                  }
                })
            }
          }
        )
      }
    }
  }
}

export const initOrdersStore = initialState => {
  return new OdersStore(isServer, initialState)
}
