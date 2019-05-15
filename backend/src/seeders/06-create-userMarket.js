const { findAssociations } = require('../helpers/models')
const db = require('../models')
const { user: User, market: Market } = db

module.exports = {

  up: async (queryInterface, Sequelize) => {
    const users = await findAssociations(User, 'publicAddress')
    const markets = await findAssociations(Market, 'tokens')

    return queryInterface.bulkInsert('userMarket', [
      {
        userId: users['0x96241186ca4aa79f5bd593a02c29a38da785251e'], // admin@
        marketId: markets['EMPR-WETH'],
      }, {
        userId: users['0x96241186ca4aa79f5bd593a02c29a38da785251e'], // admin@
        marketId: markets['HOT-WETH'],
      }, {
        userId: users['0x7683ddb7451d684d320baf7aabcd0298a8c941da'], // rmalizderskyi@
        marketId: markets['EMPR-WETH'],
      }, {
        userId: users['0x7683ddb7451d684d320baf7aabcd0298a8c941da'], // rmalizderskyi@
        marketId: markets['WTC-WETH'],
      }, {
        userId: users['0x7683ddb7451d684d320baf7aabcd0298a8c941da'], // rmalizderskyi@
        marketId: markets['BAT-WETH'],
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userMarket', null, {})
  },
}
