const server = require('../../../index')
const agent = require('supertest').agent(server)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyLCJwdWJsaWNBZGRyZXNzIjoiMHhhOD' +
  'BmZjA4ZDA4ODA5YjI5YzczMzEzNWIxYjkzYTA3Nzk5ZTVkMTdmIn0sImlhdCI6MTU1NDI4NzA5NH0.u-tN-7YKjA3MzkTrQlDx5Bkd4' +
  '1lVRE9C8fs3_9e6KuM'

describe('Dashboard (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('get trade dashboard by market id', async () => {
    expect.assertions(2)
    const response = await agent.get('/api/v1/dashboard/trade/11')
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(response.body).toMatchSnapshot()
  })

  it('get landing dashboard. All markets', async () => {
    expect.assertions(2)
    const response = await agent.get('/api/v1/dashboard/landing')
      .set('Authorization', 'Bearer ' + token)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(response.body).toMatchSnapshot()
  })
})
