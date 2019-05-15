const _ = require('lodash')
const { CONTRACT_GAS, ORDER_STATUS, SUPPORTED_ORDER_VERSION, ORDER_SIDE } = require('../../constants/order')

const BigNumber = require('bignumber.js')
const crypto = require('crypto')
const db = require('../../models')
const { FEE_RATE_BASE } = require('../../constants/market')
const { web3 } = require('../../lib/web3')
const { RELAYER } = require('../../config/web3')
const {
  keccak256,
  ecsign,
} = require('ethereumjs-util')
const gethSigPrefix = '\x19Ethereum Signed Message:\n32'

const {
  market: Market,
  user: User,
} = db

function padToBytes32 (n) {
  while (n.length < 64) n += '0'
  return '0x' + n
}

const sha3ToHex = message => {
  return '0x' + keccak256(message).toString('hex')
}

const EIP712_DOMAIN_TYPEHASH = sha3ToHex('EIP712Domain(string name)')

const EIP712_ORDER_TYPE = sha3ToHex(
  'Order(address trader,address relayer,address baseToken,address quoteToken,uint256 ' +
  'baseTokenAmount,uint256 quoteTokenAmount,uint256 gasTokenAmount,bytes32 data)'
)

const generateOrderData = (order) => {
  let res = '0x'
  res += addLeadingZero(new BigNumber(order.version).toString(16), 2)
  res += order.isSell ? '01' : '00'
  res += order.isMarket ? '01' : '00'
  res += addLeadingZero(new BigNumber(order.expiredAtSeconds).toString(16), 5 * 2)
  res += addLeadingZero(new BigNumber(order.asMakerFeeRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(order.asTakerFeeRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(order.makerRebateRate).toString(16), 2 * 2)
  res += addLeadingZero(new BigNumber(order.salt).toString(16), 8 * 2)

  return addTailingZero(res, 66)
}

function addLeadingZero (str, length) {
  let len = str.length
  return '0'.repeat(length - len) + str
}

function addTailingZero (str, length) {
  let len = str.length
  return str + '0'.repeat(length - len)
}

const getOrderHash = (order) => {
  return getEIP712MessageHash(
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

function getEIP712MessageHash (message) {
  return sha3ToHex('0x1901' + getDomainSeparator().slice(2) + message.slice(2), {
    encoding: 'hex',
  })
}

function getDomainSeparator () {
  return sha3ToHex(
    EIP712_DOMAIN_TYPEHASH +
    sha3ToHex('Hydro Protocol').slice(2)
  )
}

function ethSign (data, pk) {
  const hash = web3.utils.soliditySha3(gethSigPrefix, data)
  let { v, r, s } = ecsign(Buffer.from(hash.slice(2), 'hex'), pk)
  return { v, r: '0x' + r.toString('hex'), s: '0x' + s.toString('hex') }
}

/**
 *
 * @param version - version = 2
 * @param trader - user PublicAddress
 * @param relayer - internal relayer address
 * @param baseToken
 * @param quoteToken
 * @param baseTokenAmount
 * @param quoteTokenAmount
 * @param gasTokenAmount
 * @param isSell
 * @param isMarket
 * @param expiredAtSeconds
 * @param asMakerFeeRate
 * @param asTakerFeeRate
 * @param makerRebateRate
 * @param salt
 * @returns {Promise<*>}
 */
const getTradeOrderHash = async (
  version,
  trader,
  baseToken,
  quoteToken,
  baseTokenAmount,
  quoteTokenAmount,
  gasTokenAmount,
  isSell,
  isMarket,
  expiredAtSeconds,
  asMakerFeeRate,
  asTakerFeeRate,
  makerRebateRate,
  salt
) => {
  const traderOrder = {
    version,
    trader,
    relayer: RELAYER,
    baseToken,
    quoteToken,
    baseTokenAmount,
    quoteTokenAmount,
    gasTokenAmount,
    isSell,
    isMarket,
    expiredAtSeconds,
    asMakerFeeRate,
    asTakerFeeRate,
    makerRebateRate,
    salt,
  }

  traderOrder.data = generateOrderData(traderOrder)
  const traderOrderHash = getOrderHash(traderOrder)

  return traderOrderHash
}

/**
 *
 * @param gasPrice - for test orders = 10
 * @param baseDecimals - from market, for test = 18
 * @param takerAmount = taker order amount or takerAmount= baseTokenAmount/ Math.pow(10, baseDecimals),
 * @returns {string}
 */
const getGasAmount = (gasPrice, baseDecimals, takerAmount) => {
  return new BigNumber(gasPrice / Math.pow(10, 9))
    .multipliedBy(new BigNumber(CONTRACT_GAS))
    .multipliedBy(new BigNumber(Math.pow(10, baseDecimals))) // Gwei to Wei
    .multipliedBy(new BigNumber(takerAmount))
    .toFixed(0)
}

/**
/**
 *
 * @param trader - trader address
 * @param traderPrivateKey
 * @param price - order price = amount * 1 token price
 * @param amount - order amount of token to but/sell
 * @param tokens - pair of tokens to exchange e.g. BNB-WETH
 * @param expiredAtSeconds
 * @returns {Promise<{relayer, makerRebateRate, asMakerFeeRate, salt, expiredAtSeconds, trader,
 * quoteToken, version, isSell, baseToken, gasTokenAmount, baseTokenAmount, asTakerFeeRate,
 * quoteTokenAmount, isMarket}&{signature: {r: (string|*), s: (string|*), config: (*|string)}}>}
 */
const getSignedOrder = async ({
  traderPublicAddress,
  traderPrivateKey,
  price,
  amount,
  tokens,
  expiredAtSeconds,
  isSell,
  isMarket,
  status,
  createdAt,
  updatedAt,
  leftPrice,
  leftAmount,
}
) => {
  const traderPrivateKeyHex = Buffer.from(traderPrivateKey, 'hex')

  const market = await Market.findOne({
    where: { tokens },
    attributes: [
      'id',
      'baseTokenAddress',
      'quoteTokenAddress',
      'baseTokenDecimals',
      'quoteTokenDecimals',
      'asMakerFeeRate',
      'asTakerFeeRate',
    ],
  })
  const userId = _.get(await User.findOne({
    where: { publicAddress: traderPublicAddress },
    attributes: ['id'],
  }), 'id')

  const {
    id: marketId,
    baseTokenAddress, // e.g. BNB token
    quoteTokenAddress, // e.g. WETH token
    baseTokenDecimals,
    quoteTokenDecimals,
    asMakerFeeRate,
    asTakerFeeRate,
  } = market

  const gasTokenAmount = getGasAmount(10, baseTokenDecimals, amount)

  const makerOrder = {
    version: SUPPORTED_ORDER_VERSION, // uint256 public constant SUPPORTED_ORDER_VERSION = 2
    trader: traderPublicAddress,
    relayer: RELAYER,
    baseToken: baseTokenAddress,
    quoteToken: quoteTokenAddress,
    baseTokenAmount: new BigNumber(amount).multipliedBy(Math.pow(10, baseTokenDecimals)).toFixed(),
    quoteTokenAmount: new BigNumber(amount)
      .multipliedBy(new BigNumber(price))
      .multipliedBy(Math.pow(10, quoteTokenDecimals))
      .toFixed(),
    gasTokenAmount,
    isSell,
    isMarket,
    expiredAtSeconds, // expires in a year: Math.floor(Date.now()/1000) + 60*60*24*365
    // uint256 public constant FEE_RATE_BASE = 100000
    asTakerFeeRate: new BigNumber(asTakerFeeRate).multipliedBy(FEE_RATE_BASE),
    // uint256 public constant FEE_RATE_BASE = 100000
    asMakerFeeRate: new BigNumber(asMakerFeeRate).multipliedBy(FEE_RATE_BASE),
    makerRebateRate: 0, // uint256 public constant FEE_RATE_BASE = 100
    // 8 bytes available in order.data, but JS handles only 53 bits (< 7 bytes)
    salt: parseInt(crypto.randomBytes(6).toString('hex'), 16),
  }

  makerOrder.data = generateOrderData(makerOrder)

  const orderHash = getOrderHash(makerOrder)

  const makerOrderSigVRS = ethSign(orderHash, traderPrivateKeyHex)
  let makerOrderSigConfig = Number(makerOrderSigVRS.v).toString(16) + '00' // 01 - for EIP712 (00 - for EthSign)
  makerOrderSigConfig = padToBytes32(makerOrderSigConfig)

  let baseTokenAmount = makerOrder.baseTokenAmount
  let quoteTokenAmount = makerOrder.quoteTokenAmount

  if (!_.isUndefined(leftAmount) && !_.isUndefined(leftPrice)) {
    baseTokenAmount = new BigNumber(leftAmount).multipliedBy(Math.pow(10, baseTokenDecimals)).toFixed(0)
    quoteTokenAmount = new BigNumber(leftAmount)
      .multipliedBy(leftPrice)
      .multipliedBy(Math.pow(10, quoteTokenDecimals))
      .toFixed(0)
  }

  return {
    side: isSell ? ORDER_SIDE.SELL : ORDER_SIDE.BUY,
    isMarketOrder: isMarket,
    baseTokenAmount,
    quoteTokenAmount,
    initBaseTokenAmount: makerOrder.baseTokenAmount,
    initQuoteTokenAmount: makerOrder.quoteTokenAmount,
    gasTokenAmount: makerOrder.gasTokenAmount,
    data: makerOrder.data,
    signatureConfig: makerOrderSigConfig,
    signatureR: makerOrderSigVRS.r,
    signatureS: makerOrderSigVRS.s,
    expiresAt: expiredAtSeconds,
    status: status || ORDER_STATUS.PENDING,
    userId,
    marketId,
    createdAt: createdAt || new Date(),
    updatedAt: updatedAt || new Date(),
  }
}

module.exports = {
  getTradeOrderHash,
  getSignedOrder,
  getGasAmount,
}
