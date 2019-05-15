'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userMarket', {
      userId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      marketId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'market',
          key: 'id',
        },
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userMarket')
  },
}
