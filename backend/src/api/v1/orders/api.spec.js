const server = require('../../../index')
const agent = require('supertest').agent(server)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJwdWJsaWNBZGRyZXNzIj' +
  'oiMHg5NjI0MTE4NmNhNGFhNzlmNWJkNTkzYTAyYzI5YTM4ZGE3ODUyNTFlIn0sImlhdCI6MTU1NTQyMzE2Mn0.lVzu2XbZ98Cj' +
  '73wOW7phe5py-LT_uq1uFlaQpjsYqho'
const db = require('../../../models')
const { order: Order } = db
const { ORDER_STATUS } = require('../../../constants/order')
const { map, invokeMap } = require('lodash')

const body = {
  baseTokenAmount: 1000000000000000,
  data: '0x020000005e9714000064012c000000001d90774f2ba200000000000000000000',
  gasTokenAmount: 1900000000000,
  quoteTokenAmount: 1000000000000000,
  signature: {
    config: '0x1c00000000000000000000000000000000000000000000000000000000000000',
    r: '0xc830678dca42c91c150f9d4fc77429f5b93ec0e9cf3f4b5e46007d512a73428e',
    s: '0x324fdcd3ddce6d6ebe1425e7ee896513ec71c36a7806d32b375d14cf415fe9a6',
  },
  tokens: 'EMPR-WETH',
  trader: '0x96241186ca4aa79f5bd593a02c29a38da785251e',
}

describe('Orders (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  // WIP
  it('find order match to process in blockchain', async () => {
    expect.assertions(2)
    const response = await agent.put('/api/v1/orders/match/1')
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))
    expect(response.status).toEqual(204)

    const orders = invokeMap(await Order.findAll({
      where: { status: ORDER_STATUS.MATCHING },
      attributes: ['id'],
      order: [['id', 'ASC']],
    }), 'get', { plain: true })

    const ids = map(orders, 'id')
    expect(ids).toEqual(expect.arrayContaining([1, 13]))
  })

  it('create order', async () => {
    expect.assertions(1)
    const response = await agent.post('/api/v1/orders')
      .set('Authorization', 'Bearer ' + token)
      .send(body)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
  })

  it('get user orders', async () => {
    expect.assertions(1)
    const response = await agent.get('/api/v1/orders/user/1')
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
  })
})
