import _ from 'lodash'

import db from '../../../models'
const { user: User } = db
const ATTRIBUTES = ['id', 'nonce']

export const getByPublicAddress = async (ctx, next) => {
  await next()
  const { publicAddress } = ctx.query

  const usersObject = await User.findOne({
    where: { publicAddress },
    attributes: [...ATTRIBUTES],
  })
  ctx.assert(!_.isNil(usersObject), 404, `Can't find user`)

  ctx.body = usersObject
}

export const getById = async (ctx, next) => {
  await next()
  const { userId } = ctx.params

  const userObject = await User.findByPk(userId, { attributes: ATTRIBUTES })
  ctx.assert(!_.isNil(userObject), 404, 'User not found')

  ctx.body = userObject
}

export const create = async (ctx, next) => {
  await next()
  const { body } = ctx.request
  try {
    ctx.body = _.pick(await User.create(body), ATTRIBUTES)
  } catch (e) {
    ctx.throw(500, `Can't create user`, e.message)
  }
}

export const update = async (ctx, next) => {
  await next()
  const { userId } = ctx.params
  const { body } = ctx.request

  try {
    const userObject = await User.findByPk(userId)
    ctx.assert(!_.isNil(userObject), 404, 'User not found')
    ctx.assert(userObject.id === ctx.state.user.id, 500, `You can't update other user`)

    Object.assign(userObject, body)
    userObject.save({ returning: true })

    ctx.body = userObject
  } catch (e) {
    ctx.throw(500, `Can't update user`, e.message)
  }
}
