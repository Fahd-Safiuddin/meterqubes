import * as React from 'react'
import debounce from 'lodash/debounce'
import { inject, observer } from 'mobx-react'
import openSocket from 'socket.io-client'
import { NextContext, NextComponentClass } from 'next'
import { getUserToken } from '../utils/cookieService'
import { OrdersStoreTypes } from '../stores/order/types'
import { TradeHistoryStoreTypes } from '../stores/tradeHistory/types'
import { SOCKET_URL } from '../config/api'

export const withSocket = (Component: NextComponentClass | any) => {
  @inject(
    ({
      ordersStore: { addOrderBook, orderBook, getOrders },
      tradeHistoryStore: { getHistory }
    }) => ({
      addOrderBook,
      orderBook,
      getOrders,
      getHistory
    })
  )
  @observer
  class SocketHOC extends React.Component<{
    query: { market: number | string }
    orderBook: OrdersStoreTypes['orderBook']
    addOrderBook: OrdersStoreTypes['addOrderBook']
    getOrders: OrdersStoreTypes['getOrders']
    getHistory: TradeHistoryStoreTypes['getHistory']
  }> {
    public static getInitialProps(ctx: NextContext) {
      if (Component.getInitialProps) return Component.getInitialProps(ctx)
    }

    componentDidMount() {
      const { query, addOrderBook, getOrders, getHistory } = this.props
      const socket = openSocket(SOCKET_URL)

      const token = getUserToken()

      let connected = false
      socket.on('connect', () => {
        connected = true
        console.log('[SOCKET CONNECTED]', connected)

        socket.emit('auth', { accessToken: 'Bearer ' + token })
      })

      socket.on('newTrade', data => {
        console.log('[SOCKET MESSAGE] newTrade fired. data=', data)
        getHistory(query.market)
      })

      socket.on('newOrder', (data: OrdersStoreTypes['orderBook']) => {
        console.log('[SOCKET MESSAGE] newOrder fired. data=', data)
        if (+window.location.search.split('=')[1] === +data.marketId) {
          addOrderBook(data)
        }
      })

      socket.on('dashboard', data => {
        console.log('[SOCKET MESSAGE] dashboard fired. data=', data)
      })

      socket.on('orderChanged', () => {
        getOrders(query.market)
      })
    }

    createAction = debounce(() => {}, 1000)

    public render() {
      return <Component {...this.props} />
    }
  }

  return SocketHOC
}
