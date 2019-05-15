import _ from 'lodash'
import request from 'request-promise-native'
import { socketUri } from '../../config/socket'
import { EVENT } from '../../constants/socket'
import { getTradeHistoryByTransactionId } from '../../helpers/trade'
import { getOrderHistoryByOrderId } from '../../helpers/order'

const getOptions = (uri, body) => {
  return {
    method: 'POST',
    uri,
    body,
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
    },
  }
}

const isEventValid = (event) => {
  console.log(`_.has(EVENT, event)= ${_.has(EVENT, event)}`)
  return _.has(EVENT, event)
}

export const emitToAll = async (event, data) => {
  if (!isEventValid) throw Error(`Event "${event}" is not valid`)

  const uri = `${socketUri}/sendToAll`
  const body = { event, payload: data }

  await request(getOptions(uri, body))
}

export const emitToUser = async (event, data, userId) => {
  try {
    if (!isEventValid) throw Error(`Event "${event}" is not valid`)

    const uri = `${socketUri}/sendToUser`
    const body = { event, payload: data, userId }

    await request(getOptions(uri, body))
  } catch (e) {
    console.error(`Emit event to user failed. ${e.message}`)
  }
}

export const emitDataChangedInOrdersByUser = async (orders, changedData) => {
  try {
    if (_.isNil(changedData)) {
      throw Error('No order id or userId to emit order data change to user')
    }

    if (!Array.isArray(orders)) orders = [orders]
    if (_.isNil(orders[0].id) || _.isNil(orders[0].userId)) {
      throw Error('No order id or userId to emit order data change to user')
    }

    for (const { id, userId } of orders) {
      await emitToUser(EVENT.ORDER_CHANGED, { id, ...changedData }, userId)
    }
  } catch (e) {
    console.error(`Emit event by user id failed. ${e.message}`)
  }
}

export const emitNewTradeToHistory = async (transactionId) => {
  try {
    const data = await getTradeHistoryByTransactionId(transactionId)

    await emitToAll(EVENT.NEW_TRADE, data)
  } catch (e) {
    console.error(`Emit event to all users failed. ${e.message}`)
  }
}

export const emitNewOrderToHistory = async (orderId) => {
  try {
    const data = await getOrderHistoryByOrderId(orderId)

    await emitToAll(EVENT.NEW_ORDER, data)
  } catch (e) {
    console.error(`Emit event to all users failed. ${e.message}`)
  }
}
