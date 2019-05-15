import _ from 'lodash'
import db from '../../../../models'
const { user: User, sequelize: { literal } } = db
const ATTRIBUTES = ['publicAddress']
const firstPageSize = 30
const pageSize = 20

const getUserTotal = () => {
  return '(SELECT COUNT(*) FROM "user")'
}

const paginate = (page) => {
  let offset = 0

  if (page && page > 1) { offset = firstPageSize + (page - 2) * pageSize }
  const limit = offset ? offset + pageSize : firstPageSize

  return { limit, offset }
}

export const getUserWallets = async (ctx, next) => {
  // await next()

  const { page } = ctx.query

  let users = _.invokeMap(await User.findAll({
    attributes: [
      ...ATTRIBUTES,
      [literal(getUserTotal()), 'total'],
    ],
    ...paginate(page),
    order: [['id', 'ASC']],
  }), 'get', { plain: true })
  ctx.assert(!_.isEmpty(users), 404, 'Users not found with given page')

  const from = ((Math.floor(users[0].total / pageSize)) + 1).toString()

  ctx.body = {
    total: users[0].total,
    page: page || 1,
    from,
    users: _.map(users, 'publicAddress'),

  }
}
