const server = require('../../../index')
const agent = require('supertest').agent(server)
const moment = require('moment')
const expectedResult1 = [
  '0.500000000',
  '0.356000000',
  '-0.144000000',
  '-28.80',
  '0.356000000',
  '0.500000000',
  '-',
  '-',
  '-',
]
expectedResult1.unshift(moment().format('YYYY/MM/DD'))

const expectedResult2 = [
  '0.500000000',
  '0.500000000',
  '0.000000000',
  '0.00',
  '0.500000000',
  '0.500000000',
  '-',
  '-',
  '-',
]
expectedResult2.unshift(moment().subtract(6, 'days').format('YYYY/MM/DD'))

describe('Chart (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('get chart data for last 5 days', async () => {
    expect.assertions(3)
    const response = await agent.get('/api/v1/chart?marketId=11&period=5')
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(4)
    expect(response.body[0]).toEqual(expect.arrayContaining(expectedResult1))
  })

  it('get chart data for last 30 days', async () => {
    expect.assertions(3)
    const response = await agent.get('/api/v1/chart?marketId=11&period=30')
      .catch(err => console.error(err))

    const last = response.body.length

    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(5)
    expect(response.body[last - 1]).toEqual(expect.arrayContaining(expectedResult2))
  })
})
