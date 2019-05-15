import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import moment from 'moment'
import { isServer } from '../../utils/isServer'
import { TradeHistoryStoreTypes } from './types'
import { apiCaller } from '../../utils/apiCaller'
import { API_URL } from '../../config/api'
import { bind } from '../../utils/bind'

useStaticRendering(isServer)

class TradeHistoryStore {
  @observable public history: TradeHistoryStoreTypes['history']

  constructor({}, initialState: TradeHistoryStoreTypes) {
    this.history = initialState ? initialState.history : []
  }

  @bind @action public async getHistory(marketId: number = 1) {
    const { data } = await apiCaller(`${API_URL}/trade/history/${marketId}`)

    let history: TradeHistoryStoreTypes['history'] = []

    for (let i in data) history.push(...data[i])

    this.history = history
      ? history.map(({ createdAt, side, price, amount }) => ({
          createdAt: moment(createdAt).format('DD/MM/YYYY HH:mm'),
          side,
          price,
          amount
        }))
      : []
  }

  @bind @action public setHistory(history: TradeHistoryStoreTypes['history']) {
    this.history = history
  }
}

export const initTradeHistoryStore = initialState => {
  return new TradeHistoryStore(isServer, initialState)
}
