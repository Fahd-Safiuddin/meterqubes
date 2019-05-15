const server = require('../../../index')
const agent = require('supertest').agent(server)

const body = {
  'publicAddress': '0xebce153006a7572a1ac58295385afcf8fddc8933',
  'username': 'emaDDDil@gmail.com',
}

describe('Users (API)', function () {
  afterAll(async () => {
    await server.close()
  })

  it('create user', async () => {
    expect.assertions(2)
    const response = await agent.post('/api/v1/users')
      .send(body)
      .catch(err => console.error(err))

    expect(response.status).toEqual(200)
    expect(response.body.id).toEqual(4)
  })

  it('get user by publicAddress', async () => {
    expect.assertions(2)
    const response = await agent.get('/api/v1/users/?publicAddress=0xebce153006a7572a1ac58295385afcf8fddc8933')
      .catch(err => console.error(err))
    expect(response.status).toEqual(200)
    expect(response.body.id).toEqual(4)
  })
})
