'use strict'
const { ORDER_TYPE } = require('../constants/market')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('market', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tokens: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      baseToken: {
        type: Sequelize.STRING,
      },
      baseTokenProjectUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      baseTokenName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      baseTokenDecimals: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: { min: 0, max: 18 },
      },
      baseTokenAddress: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quoteToken: {
        type: Sequelize.STRING,
      },
      quoteTokenDecimals: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: { min: 0, max: 18 },
      },
      quoteTokenAddress: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      minOrderSize: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      pricePrecision: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      priceDecimals: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: { min: 0, max: 18 },
      },
      amountDecimals: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      asMakerFeeRate: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      asTakerFeeRate: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      supportedOrderTypes: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.ENUM(Object.values(ORDER_TYPE))),
      },
      marketOrderMaxSlippage: {
        allowNull: false,
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('market')
  },
}
