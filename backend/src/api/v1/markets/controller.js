import _ from 'lodash'
import db from '../../../models'
import { Op } from 'sequelize'
const { market: Market } = db

const MARKET_ATTRIBUTES = [
  'id',
  'tokens',
  'baseToken',
  'baseTokenProjectUrl',
  'baseTokenName',
  'baseTokenDecimals',
  'baseTokenAddress',
  'quoteToken',
  'quoteTokenDecimals',
  'quoteTokenAddress',
  'minOrderSize',
  'pricePrecision',
  'priceDecimals',
  'amountDecimals',
  'asMakerFeeRate',
  'asTakerFeeRate',
  'supportedOrderTypes',
  'marketOrderMaxSlippage',
]

export const findByTokenName = async (ctx, next) => {
  await next()
  const { token } = ctx.query
  const options = token ? {
    where: {
      [Op.or]: [
        { baseToken: { [Op.iLike]: `%${token}%` } },
        { quoteToken: { [Op.iLike]: `%${token}%` } },
      ],
    },
  } : {}

  options.attributes = MARKET_ATTRIBUTES

  ctx.body = await Market.findAll(options)
}

export const getById = async (ctx, next) => {
  await next()
  const {
    params: { marketId },
  } = ctx
  const marketObject = await Market.findByPk(marketId, { attributes: MARKET_ATTRIBUTES })
  ctx.assert(!_.isNil(marketObject), 500, 'Market not found')
  ctx.status = 200
  ctx.body = marketObject
}

// add market
export const create = async (ctx, next) => {
  await next()
  const {
    request: { body: payload },
  } = ctx
  try {
    const marketObject = await Market.create(payload, { returning: true })
    ctx.status = 200
    ctx.body = marketObject
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: `Can't create market`,
    }
  }
}

export const modify = async (ctx, next) => {
  await next()
  const {
    params: { marketId },
    request: { body: payload },
  } = ctx
  try {
    const marketObject = await Market.findByPk(marketId)
    ctx.assert(!_.isNil(marketObject), 500, 'Market not found')
    Object.assign(marketObject, payload)
    marketObject.save({ returning: true })
    ctx.status = 200
    ctx.body = marketObject
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: `Can't modify market`,
    }
  }
}

export const remove = async (ctx, next) => {
  await next()
  const { query: { marketId } } = ctx
  try {
    // Return: Promise<Integer> The number of destroyed rows
    const destroyedRowsNum = await Market.destroy({ where: { marketId } })
    ctx.assert(destroyedRowsNum === 1, 500, 'Market not removed')
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: `Can't remove market`,
    }
  }
}
