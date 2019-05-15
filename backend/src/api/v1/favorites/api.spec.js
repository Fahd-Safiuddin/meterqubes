const server = require('../../../index')
const agent = require('supertest').agent(server)
const { secret } = require('../../../config/jwt')
const { verify } = require('jsonwebtoken')
const { _ } = require('lodash')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJwdWJsaWNBZGRyZXNzIjoiMHg5NjI0MTE4NmNh' +
  'NGFhNzlmNWJkNTkzYTAyYzI5YTM4ZGE3ODUyNTFlIn0sImlhdCI6MTU1NTQyMzE2Mn0.lVzu2XbZ98Cj73wOW7phe5py-LT_uq1uFlaQpjsYqho'
const db = require('../../../models')
const { userMarket: UserMarket } = db
const marketId = 4
const expectedResult1 = [marketId]

describe('Favorites (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('get user favorites markets', async () => {
    expect.assertions(2)
    const response = await agent.get('/api/v1/favorites')
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(response.body).toMatchSnapshot()
  })

  it('add user favorites markets', async () => {
    expect.assertions(2)
    const response = await agent.put(`/api/v1/favorites/${marketId}`)
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    const user = _.get(verify(token.replace('Bearer ', ''), secret), 'payload', {})

    const userMarket = _.invokeMap(await UserMarket.findAll({
      where: { userId: user.id },
    }), 'get', { plain: true })

    const userMarketIds = _.map(userMarket, 'marketId')

    expect(response.status).toEqual(204)
    expect(userMarketIds).toEqual(expect.arrayContaining(expectedResult1))
  })

  it('remove market from user favorites', async () => {
    expect.assertions(2)
    const response = await agent.delete(`/api/v1/favorites/${marketId}`)
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    const user = _.get(verify(token.replace('Bearer ', ''), secret), 'payload', {})

    const userMarket = _.invokeMap(await UserMarket.findAll({
      where: { userId: user.id },
    }), 'get', { plain: true })

    const userMarketIds = _.map(userMarket, 'marketId')

    expect(response.status).toEqual(204)
    expect(userMarketIds).not.toEqual(expect.arrayContaining(expectedResult1))
  })
})
