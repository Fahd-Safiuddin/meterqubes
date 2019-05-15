import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import debounce from 'lodash/debounce'
import { isServer } from '../../utils/isServer'
import { MarketsStoreTypes, MarketTypes } from './types'
import { apiCaller } from '../../utils/apiCaller'
import { API_URL, ETHPRICE_API_URL, ETHPRICE_KEY } from '../../config/api'
import { bind } from '../../utils/bind'

useStaticRendering(isServer)

class MarketsStore {
  @observable markets: MarketsStoreTypes['markets']
  @observable selectedMarket: MarketsStoreTypes['selectedMarket']
  @observable marketDetails: MarketsStoreTypes['marketDetails']
  @observable gasPrice: MarketsStoreTypes['gasPrice']

  constructor({}, initialState: MarketsStoreTypes) {
    this.gasPrice = initialState ? initialState.gasPrice : null
    this.markets = initialState ? initialState.markets : []
    this.selectedMarket = initialState ? initialState.selectedMarket : null
    this.marketDetails = initialState ? initialState.marketDetails : null
  }

  @bind @action selectMarket(market: MarketsStoreTypes['selectedMarket']) {
    if (market) {
      this.selectedMarket = market
    }
  }

  @action getMarkets = debounce(async term => {
    const markets = await apiCaller(
      `${API_URL}/markets${term ? `?token=${term}` : ''}`
    )

    const marketHistory = await apiCaller(`${API_URL}/order-book/history`)

    const newData: MarketsStoreTypes['markets'] = markets.map(
      ({
        id,
        tokens,
        baseToken,
        baseTokenAddress,
        quoteToken,
        quoteTokenAddress
      }: MarketTypes) => {
        const { amount, lastPrice, changeRate } = marketHistory.find(
          (item: { tokens: string }) => item.tokens === tokens
        )

        return {
          id,
          tokens,
          baseToken,
          baseTokenAddress,
          quoteToken,
          quoteTokenAddress,
          dayVol: amount,
          price: lastPrice,
          dayPrice: changeRate
        }
      }
    )

    this.markets = newData

    const market =
      newData[Number(window.location.search.split('=')[1]) - 1] || newData[0]

    if (!this.selectedMarket) {
      this.selectMarket(market)
    }
  }, 500)

  @bind @action public removeGasPrice() {
    this.gasPrice = null
  }

  @bind @action public async getMarketDetails(marketId: number) {
    const data = await apiCaller(`${API_URL}/dashboard/trade/${marketId || 1}`)
    let price
    if (!this.gasPrice) {
      const {
        result: { ethusd }
      } = await apiCaller(
        `${ETHPRICE_API_URL}api?module=stats&action=ethprice&apikey=${ETHPRICE_KEY}`
      )
      price = +ethusd
    }

    this.gasPrice = data.lastPrice * price || 0

    this.marketDetails = {
      ...data,
      lastPriceUSD: this.gasPrice
    }
  }
}

export const initMarketsStore = initialState => {
  return new MarketsStore(isServer, initialState)
}
