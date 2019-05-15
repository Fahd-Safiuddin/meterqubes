'use strict'
const { ORDER_SIDE, ORDER_STATUS } = require('../constants/order')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      marketId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'market',
          key: 'id',
        },
      },
      side: {
        allowNull: false,
        type: Sequelize.ENUM(Object.values(ORDER_SIDE)),
      },
      isMarketOrder: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      baseTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      quoteTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      initBaseTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      initQuoteTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      gasTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      data: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      signatureConfig: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      signatureR: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      signatureS: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      expiresAt: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(Object.values(ORDER_STATUS)),
        defaultValue: ORDER_STATUS.PENDING,
      },
      previousStatus: {
        allowNull: true,
        type: Sequelize.ENUM(Object.values(ORDER_STATUS)),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('order')
  },
}
