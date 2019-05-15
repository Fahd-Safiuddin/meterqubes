import { exchangeContract, web3, web3Http } from '../../lib/web3'
import {
  CONTRACT_GAS_LIMIT,
  EXCHANGE_ADDRESS,
  NUMBER_BLOCK_TO_WAIT,
  RELAYER,
  RELAYER_PRIVATE_KEY,
} from '../../config/web3'
import createError from 'http-errors'
import db from '../../models'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'
import moment from 'moment'

const {
  transaction: Transaction,
} = db

/**
 *
 * @param dataEncodedAbi = contractInstance.methods.matchOrders(traderOrderParam, makerOrderParams,
 * baseTokenFilledAmounts, orderAddressSet).encodeABI()
 * @returns {Promise<any>} null - if no error or error message
 */
const getContractError = async (dataEncodedAbi) => {
  const resultHex = await web3.eth.call({
    from: RELAYER,
    to: EXCHANGE_ADDRESS,
    data: dataEncodedAbi,
  })
  if (_.isNil(resultHex)) throw createError(500, 'Get contract error fail')
  const result = web3.utils.hexToAscii(resultHex)

  return result ? result.match(/[a-zA-Z_]+/g)[1] : null
}

const createOrderTransaction = async (data) => {
  return Transaction.create(data)
}

const updateTransactionError = (id, errMsg) => {
  return Transaction.update({ errMsg }, { where: { id } })
}

const updateTransaction = (id, data) => {
  return Transaction.update(data, { where: { id } })
}

const getTransactionReceipt = async (txHash) => {
  let txReceipt = null

  try {
    txReceipt = await web3.eth.getTransactionReceipt(txHash)
    if (_.isNil(txReceipt)) return null
  } catch (e) {
    console.error(`getTransactionReceipt error: ${e.message}`)
    throw Error(`getTransactionReceipt error: ${e.message}`)
  }

  txReceipt.err = ''
  return txReceipt
}

const getMatchOrdersData = (dataParams) => {
  const {
    traderOrderParam,
    makerOrderParams,
    baseTokenFilledAmounts,
    orderAddressSet,
  } = dataParams
  try {
    return exchangeContract.methods.matchOrders(
      traderOrderParam,
      makerOrderParams,
      baseTokenFilledAmounts,
      orderAddressSet
    ).encodeABI()
  } catch (e) {
    throw Error(`Cannot get data for contract method: ${e.message}`)
  }
}

export const sendTransaction = async (orderId, transactionOption) => {
  const {
    traderOrderParam,
    makerOrderParams,
    baseTokenFilledAmounts,
    orderAddressSet,
  } = transactionOption

  if (
    _.isNil(orderId) ||
    _.isNil(traderOrderParam) ||
    _.isNil(makerOrderParams) ||
    _.isNil(baseTokenFilledAmounts) ||
    _.isNil(orderAddressSet)
  ) {
    throw createError(500, 'Invalid arguments for send transaction')
  }

  let txReceipt = null
  let waitingBlocks = 1
  let confirmationBlocks = 1
  let blockTimestamp = null

  console.time('getTxCount')
  const txCount = await web3.eth.getTransactionCount(RELAYER)
    .catch(e => console.error(`Get txCount error: ${e.message}`))
  if (_.isNil(txCount)) throw Error('Cannot get txCount')
  console.timeEnd('getTxCount')

  const matchOrdersData = getMatchOrdersData(transactionOption)

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(CONTRACT_GAS_LIMIT),
    gasPrice: web3.utils.toHex(10e9), // Gwei - get from API standard
    from: RELAYER,
    to: EXCHANGE_ADDRESS,
    data: matchOrdersData,
  }

  const transaction = new Tx(txData)
  await transaction.sign(RELAYER_PRIVATE_KEY)
  const serializedTx = await transaction.serialize().toString('hex')
  if (_.isNil(serializedTx)) throw Error('Cannot get serializedTx')

  const checkTransactionError = await getContractError(matchOrdersData)
  if (!_.isNil(checkTransactionError)) throw Error(`Transaction call get error: ${checkTransactionError}`)

  console.time('getTxHash')
  const tx = await web3Http.eth.sendSignedTransaction('0x' + serializedTx)
    .catch(e => { throw Error(`Get txHash error: ${e.message}`) })
  console.timeEnd('getTxHash')

  if (_.isNil(tx)) {
    const err = await getContractError(matchOrdersData)
    throw Error(`Cannot get transaction hash: ${err}`)
  }

  const txHash = _.get(tx, 'transactionHash', '')
  const orderTransaction = await createOrderTransaction({ orderId, txHash })

  const subscribeBlockHeaders = web3.eth.subscribe('newBlockHeaders')

  try {
    let watcherResults = []

    console.time('blocksWatcherResult')
    const blocksWatcherResult = await new Promise(async (resolve) => {
      subscribeBlockHeaders.on('error', err => {
        subscribeBlockHeaders.unsubscribe()
        console.error(`subscribeBlockHeaders return event 'error': ${err}`)
        watcherResults.push(`subscribeBlockHeaders return event 'error': ${err}`)
        resolve({
          err: err.message,
          txReceipt: {},
          blockNumber: null,
          blockDate: null,
          watcherResults,
        })
      })

      subscribeBlockHeaders.on('data', async blockHeader => {
        txReceipt = _.isNil(txReceipt)
          ? await getTransactionReceipt(txHash).catch(e => {
            throw Error('e')
          })
          : txReceipt

        if (!_.isNil(txReceipt) && !txReceipt.status) {
          txReceipt.err = await getContractError(matchOrdersData) // TODO do we need it here???
          subscribeBlockHeaders.unsubscribe()
          resolve({
            err: `txReceipt return false ${txReceipt.err}`,
            txReceipt: txReceipt || {},
            blockNumber: null,
            blockDate: null,
            watcherResults,
          })
          watcherResults.push(`We receive error after ${waitingBlocks} block(s)!`)
        }

        // WAITING FOR 12 BLOCKs TO GET TX RECEIPT
        if (waitingBlocks <= NUMBER_BLOCK_TO_WAIT && _.isNil(txReceipt)) {
          waitingBlocks++
          watcherResults.push(`waitingBlocks=  ${waitingBlocks}`)
        }

        const isTxReceiptError = !_.isNil(txReceipt) && !_.isEmpty(txReceipt.err)
        const IsNoReceipt = waitingBlocks >= NUMBER_BLOCK_TO_WAIT && _.isNil(txReceipt)

        if (isTxReceiptError || IsNoReceipt) {
          subscribeBlockHeaders.unsubscribe()
          console.error(`txReceipt not received after ${waitingBlocks} block(s)`)
          watcherResults.push(`We receive error after ${waitingBlocks} block(s)!`)
          resolve({
            err: isTxReceiptError
              ? txReceipt.err
              : 'Can not get tx receipt for 12 blocks already. Unsubscribed from newBlockHeaders!',
            txReceipt: {},
            blockNumber: null,
            blockDate: null,
            watcherResults,
          })
        }

        const isValidReceiptReceived = waitingBlocks <= NUMBER_BLOCK_TO_WAIT &&
          !_.isNil(txReceipt) &&
          _.isEmpty(txReceipt.err)

        if (isValidReceiptReceived) {
          blockTimestamp = _.isNil(blockTimestamp) ? blockHeader.timestamp : blockTimestamp

          if (confirmationBlocks <= NUMBER_BLOCK_TO_WAIT) {
            console.log(`Get block ${confirmationBlocks}/12 to validate transaction ...${txHash.slice(-6)}`)
            confirmationBlocks++
            watcherResults.push(`confirmationBlocks=  ${confirmationBlocks}`)
          } else {
            subscribeBlockHeaders.unsubscribe()
            const message = `Got tx receipt in block ${txReceipt.blockNumber} after waitingBlocks=${waitingBlocks}
          and confirmationBlocks= ${confirmationBlocks - 1}block(s)! Tx success: ${txReceipt.status}`
            console.log(message)
            watcherResults.push(message)
            resolve({
              err: '',
              txReceipt,
              blockNumber: txReceipt.blockNumber,
              blockDate: moment.unix(blockTimestamp).format(),
              watcherResults,
            })
          }
        }
      })
    }).catch(async e => {
      await updateTransactionError(orderTransaction.id, 'Transaction subscription failed: ' + e)
      subscribeBlockHeaders.unsubscribe()
      watcherResults.push(`Promise error: ${e.message}`)
      console.timeEnd('blocksWatcherResult')
      throw Error(`Transaction subscription failed: ${e.message}`)
    })
    console.timeEnd('blocksWatcherResult')

    if (!_.isNil(blocksWatcherResult) && !_.isEmpty(blocksWatcherResult.err)) {
      subscribeBlockHeaders.unsubscribe()
      console.error(`Transaction subscription error. blocksWatcherResult: ${blocksWatcherResult}`)
      await updateTransactionError(orderTransaction.id, blocksWatcherResult.err)
      throw Error(`Transaction subscription error: ${blocksWatcherResult.err}`)
    }

    blocksWatcherResult && await updateTransaction(
      orderTransaction.id, { blockDate: blocksWatcherResult.blockDate })

    console.log(`=== Blockchain transaction successfully finished ===`)
    console.log(`txHash= ${txHash}`)
    console.log(`blockNumber= ${blocksWatcherResult.txReceipt.blockNumber}`)

    return orderTransaction.id
  } catch (e) {
    subscribeBlockHeaders.unsubscribe()
    throw Error(e.message)
  }
}
