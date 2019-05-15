const server = require('../../../index')
const agent = require('supertest').agent(server)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyLCJwdWJsaWNBZGRyZXNzIjoiMHhhOD' +
  'BmZjA4ZDA4ODA5YjI5YzczMzEzNWIxYjkzYTA3Nzk5ZTVkMTdmIn0sImlhdCI6MTU1NDI4NzA5NH0.u-tN-7YKjA3MzkTrQlDx5Bkd4' +
  '1lVRE9C8fs3_9e6KuM'

describe('Markets (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('get all markets with token "BNB"', async () => {
    try {
      const response = await agent.get('/api/v1/markets?token=BNB')
        .catch(err => console.error(err))
      expect(response.status).toEqual(200)
      expect(response.body).toMatchSnapshot()
    } catch (e) {
      console.error(e)
      expect(e).toMatch('error')
    }
  })

  it('get all markets with token name "mk"', async () => {
    try {
      const response = await agent.get('/api/v1/markets?token=mk')
        .catch(err => console.error(err))
      expect(response.status).toEqual(200)
      expect(response.body).toMatchSnapshot()
    } catch (e) {
      console.error(e)
      expect(e).toMatch('error')
    }
  })

  it('get market with token Id=1', async () => {
    try {
      const response = await agent.get('/api/v1/markets/1')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
      expect(response.status).toEqual(200)
      expect(response.body).toMatchSnapshot()
    } catch (e) {
      console.error(e)
      expect(e).toMatch('error')
    }
  })
})
