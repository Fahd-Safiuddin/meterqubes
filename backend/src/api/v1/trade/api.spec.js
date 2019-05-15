const server = require('../../../index')
const agent = require('supertest').agent(server)
const tokenUser1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJwdWJsaWNBZGRyZXNzIj' +
  'oiMHg5NjI0MTE4NmNhNGFhNzlmNWJkNTkzYTAyYzI5YTM4ZGE3ODUyNTFlIn0sImlhdCI6MTU1NTQyMzE2Mn0.lVzu2XbZ98Cj' +
  '73wOW7phe5py-LT_uq1uFlaQpjsYqho'
const tokenUser3 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjozLCJwdWJsaWNBZGRyZXNzIjoiMHg3N' +
  'jgzZGRiNzQ1MWQ2ODRkMzIwYmFmN2FhYmNkMDI5OGE4Yzk0MWRhIn0sImlhdCI6MTU1NTc2NTkzNH0.H8DqRZS3bnpQ76' +
  'atK33vedQh5KgX888BteGjJgLrD0I'
const moment = require('moment')
const _ = require('lodash')
const today = moment().format('DD/MM/YYYY')
const expectedResult1 = [4, 4, 2]
const expectedResult2 = [4, 2]

describe('Trade (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('get trade history by market id', async () => {
    expect.assertions(2)
    const response = await agent.get('/api/v1/trade/history/11')
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(_.isEmpty(response.body)).toEqual(false)
  })

  it('get user 1 trade history by market id', async () => {
    expect.assertions(3)
    const response = await agent.get('/api/v1/trade/user-history/11')
      .set('Authorization', 'Bearer ' + tokenUser1)
      .catch(err => console.error(err))

    const ids = _.map(response.body.data[today], 'id')

    expect(response.status).toEqual(200)
    expect(_.has(response.body.data, today)).toEqual(true)
    expect(ids).toEqual(expect.arrayContaining(expectedResult1))
  })

  it('get user 3 trade history by market id', async () => {
    expect.assertions(3)
    const response = await agent.get('/api/v1/trade/user-history/11')
      .set('Authorization', 'Bearer ' + tokenUser3)
      .catch(err => console.error(err))

    const ids = _.map(response.body.data[today], 'id')

    expect(response.status).toEqual(200)
    expect(_.has(response.body.data, today)).toEqual(true)
    expect(ids).toEqual(expect.arrayContaining(expectedResult2))
  })
})
