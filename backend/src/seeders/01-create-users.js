const base64url = require('base64url')
const crypto = require('crypto')
const nonceSize = 64

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        username: 'admin@gmail.com',
        nonce: base64url(crypto.randomBytes(nonceSize)),
        publicAddress: '0x96241186ca4aa79f5bd593a02c29a38da785251e'.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        username: 'sivanchenko@s-pro.io',
        nonce: base64url(crypto.randomBytes(nonceSize)),
        publicAddress: '0xA80Ff08D08809b29c733135b1b93a07799E5d17f'.toLowerCase(),
        // publicAddress: '0x96241186ca4aa79f5bd593a02c29a38da785251e'.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        username: 'rmalizderskyi@s-pro.io',
        nonce: base64url(crypto.randomBytes(nonceSize)),
        publicAddress: '0x7683DDB7451D684d320Baf7AAbCd0298a8C941da'.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {})
  },
}
