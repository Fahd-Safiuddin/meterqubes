import BigNumber from 'bignumber.js'
import { keccak256, ecrecover, hashPersonalMessage, toBuffer, pubToAddress } from 'ethereumjs-util'
import _ from 'lodash'
import createError from 'http-errors'
import { MAKER_REBATE_RATE } from '../../../constants/market'
import { getGasAmount } from '../../../helpers/signature'

const request = require('request-promise-native')

const { ORDER_SIDE } = require('../../../constants/order')
const { FEE_RATE_BASE } = require('../../../constants/market')

const sha3ToHex = message => {
  return '0x' + keccak256(message).toString('hex')
}

const addLeadingZero = (str, length) => {
  let len = str.length
  return '0'.repeat(length - len) + str
}

const addTailingZero = (str, length) => {
  let len = str.length
  return str + '0'.repeat(length - len)
}

const getAmount = async (baseTokenDecimals, baseTokenAmount) => {
  if (!baseTokenDecimals || !baseTokenAmount) return null
  // const market = await Market.findByPk(marketId, { attributes: ['baseTokenDecimals'] })
  return new BigNumber(baseTokenAmount).dividedBy(Math.pow(10, baseTokenDecimals))
}

/**
 *
 * @param account - user public address
 * @param signature - order signature
 * @param message - traderOrderHash
 * @returns {boolean}
 */
const isValidSignature = (account, signature, message) => {
  let pubkey
  const v = parseInt(signature.config.slice(2, 4), 16)
  const method = parseInt(signature.config.slice(4, 6), 16)
  if (method === 0) {
    pubkey = ecrecover(hashPersonalMessage(toBuffer(message)), v, toBuffer(signature.r), toBuffer(signature.s))
  } else if (method === 1) {
    pubkey = ecrecover(toBuffer(message), v, toBuffer(signature.r), toBuffer(signature.s))
  } else {
    throw new Error('wrong method')
  }

  const address = '0x' + pubToAddress(pubkey).toString('hex')

  return address.toLowerCase() === account.toLowerCase()
}

const generateOrderData = (
  version,
  isSell,
  isMarket,
  expiredAtSeconds,
  asMakerFeeRate,
  asTakerFeeRate,
  makerRebateRate,
  salt
) => {
  let res = '0x'
  res += addLeadingZero(new BigNumber(version).toString(16), 2)
  res += isSell ? '01' : '00'
  res += isMarket ? '01' : '00'
  res += addLeadingZero(new BigNumber(expiredAtSeconds).toString(16), 5 * 2)
  res += addLeadingZero(new BigNumber(asMakerFeeRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(asTakerFeeRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(makerRebateRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(salt).toString(16), 8 * 2)

  return addTailingZero(res, 66)
}

const EIP712_DOMAIN_TYPEHASH = sha3ToHex('EIP712Domain(string name,string version,address verifyingContract)')
const EIP712_ORDER_TYPE = sha3ToHex(
  'Order(address trader,address relayer,address baseToken,address quoteToken,uint256 baseTokenAmount,uint256 ' +
  'quoteTokenAmount,uint256 gasTokenAmount,bytes32 data)'
)

const getDomainSeparator = hydroAddress => {
  return sha3ToHex(
    EIP712_DOMAIN_TYPEHASH +
      sha3ToHex('Hydro Protocol').slice(2) +
      sha3ToHex('1').slice(2) +
      addLeadingZero(hydroAddress.slice(2), 64)
  )
}

const getEIP712MessageHash = (hydroAddress, message) => {
  return sha3ToHex('0x1901' + getDomainSeparator(hydroAddress).slice(2) + message.slice(2), {
    encoding: 'hex',
  })
}

const getOrderHash = (hydroAddress, order) => {
  return getEIP712MessageHash(
    hydroAddress,
    sha3ToHex(
      EIP712_ORDER_TYPE +
      addLeadingZero(order.trader.slice(2), 64) +
      addLeadingZero(order.relayer.slice(2), 64) +
      addLeadingZero(order.baseToken.slice(2), 64) +
      addLeadingZero(order.quoteToken.slice(2), 64) +
      addLeadingZero(new BigNumber(order.baseTokenAmount).toString(16), 64) +
      addLeadingZero(new BigNumber(order.quoteTokenAmount).toString(16), 64) +
      addLeadingZero(new BigNumber(order.gasTokenAmount).toString(16), 64) +
      order.data.slice(2)
    )
  )
}

function getOrderVersionFromOrderData (orderData) {
  return parseInt('0x' + orderData.substr(2, 2))
}

const isSellFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(4, 2)) === 1
}

const isMarketOrderFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(6, 2)) === 1
}

const getExpiredAtFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(8, 10))
}

const getAsMakerFeeRateFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(18, 4))
}

const getAsTakerFeeRateFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(22, 4))
}

const getMakerRebateRateFromOrderData = (orderData) => {
  return parseInt('0x' + orderData.substr(26, 4))
}

// salt
function getSaltFromOrderData (orderData) {
  return parseInt('0x' + orderData.substr(30, 16))
}

const getOrderData = (data) => {
  const expiresAt = getExpiredAtFromOrderData(data)
  if (_.isNaN(expiresAt) || _.isUndefined(expiresAt)) throw createError(400, 'expiresAt is invalid')

  const makerRebateRate = getMakerRebateRateFromOrderData(data)
  if (makerRebateRate > MAKER_REBATE_RATE) throw createError(400, 'Market rebate rate is invalid')

  const version = getOrderVersionFromOrderData(data)
  if (version !== 2) throw createError(400, 'Version is invalid')

  const asMakerFeeRate = getAsMakerFeeRateFromOrderData(data)
  const asTakerFeeRate = getAsTakerFeeRateFromOrderData(data)

  const isSell = isSellFromOrderData(data)
  const isMarket = isMarketOrderFromOrderData(data)

  return {
    newOrderData: {
      side: isSell ? ORDER_SIDE.SELL : ORDER_SIDE.BUY,
      isMarketOrder: isMarket,
      asMakerFeeRate: new BigNumber(asMakerFeeRate).dividedBy(new BigNumber(FEE_RATE_BASE)),
      asTakerFeeRate: new BigNumber(asTakerFeeRate).dividedBy(new BigNumber(FEE_RATE_BASE)),
      expiresAt,
    },
    tradeOrder: {
      version,
      salt: getSaltFromOrderData(data),
      makerRebateRate,
      isSell,
      isMarket,
      expiredAtSeconds: expiresAt,
      asMakerFeeRate,
      asTakerFeeRate,
    },
  }
}

const getMinMaxGasTokenAmount = async (baseDecimals, baseTokenAmount) => {
  const uri = 'https://www.etherchain.org/api/gasPriceOracle'

  const options = {
    method: 'GET',
    uri,
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
    },
  }

  console.time('API_gasPriceOracle')
  const gasPrice = await request(options)
  if (_.isNil(gasPrice)) throw Error('Cannot get gas price from gasPriceOracle API')
  console.timeEnd('API_gasPriceOracle')

  const takerAmount = getAmount(baseDecimals, baseTokenAmount)

  const minTokenAmount = getGasAmount(gasPrice.safeLow, baseDecimals, takerAmount)
  const maxTokenAmount = getGasAmount(gasPrice.fastest, baseDecimals, takerAmount)

  return { minTokenAmount, maxTokenAmount }
}

module.exports = {
  isValidSignature,
  generateOrderData,
  EIP712_DOMAIN_TYPEHASH,
  EIP712_ORDER_TYPE,
  getOrderHash,
  getDomainSeparator,
  getEIP712MessageHash,
  getOrderData,
  getMinMaxGasTokenAmount,
}
