import db from '../../../models'
import _ from 'lodash'
const {
  user: User,
  market: Market,
} = db

export const getUserFavorites = async (ctx, next) => {
  await next()

  ctx.body = _.get(await User.findByPk(ctx.state.user.id, {
    attributes: ['id'],
    include: {
      model: Market,
      attributes: ['id'],
      as: 'favorites',
      through: { attributes: [] },
    },
  }), 'favorites')
}

export const updateUserFavorites = async (ctx, next) => {
  await next()

  const { marketId } = ctx.params

  const market = await Market.findByPk(marketId, { attributes: ['id'] })
  ctx.assert(!_.isNil(market), 404, 'Market not found')

  const hasUser = await market.hasUser(ctx.state.user.id)
  !hasUser && await market.addUser(ctx.state.user.id)

  ctx.status = 204
}

export const deleteUserFavorites = async (ctx, next) => {
  await next()

  const { marketId } = ctx.params

  const market = await Market.findByPk(marketId, { attributes: ['id'] })
  ctx.assert(!_.isNil(market), 404, 'Market not found')

  const hasUser = await market.hasUser(ctx.state.user.id)
  hasUser && await market.removeUser(ctx.state.user.id)

  ctx.status = 204
}
