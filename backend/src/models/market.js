'use strict'
const { ethUtil } = require('ethereumjs-util')
const { ORDER_TYPE } = require('../constants/market')

module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define('market', {
    tokens: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: {
          args: ['(^[A-Z0-9]*-[A-Z0-9]*$)'],
          msg: 'Invalid token name',
        },
      },
    },
    baseToken: {
      type: DataTypes.STRING,
      validate: {
        min: 3,
        isUppercase: true,
      },
    },
    baseTokenProjectUrl: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { isUrl: true },
    },
    baseTokenName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        min: 3,
      },
    },
    baseTokenDecimals: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        len: {
          args: [0, 18],
          msg: 'Base token decimals should be in range 0 to 18',
        },
      },
    },
    baseTokenAddress: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isLowercase: true,
        isAddress (value) {
          if (!ethUtil.isValidAddress(value)) {
            throw new Error('Invalid baseTokenAddress!')
          }
        },
      },
    },
    quoteToken: {
      type: DataTypes.STRING,
      validate: {
        min: 3,
        isUppercase: true,
      },
    },
    quoteTokenDecimals: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        len: {
          args: [0, 18],
          msg: 'Quote token decimals should be in range 0 to 18',
        },
      },
    },
    quoteTokenAddress: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isLowercase: true,
        isAddress (value) {
          if (!ethUtil.isValidAddress(value)) {
            throw new Error('Invalid quoteTokenAddress!')
          }
        },
      },
    },
    minOrderSize: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    pricePrecision: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    priceDecimals: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        len: {
          args: [0, 18],
          msg: 'Price decimals should be in range 0 to 18',
        },
      },
    },
    amountDecimals: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    asMakerFeeRate: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    asTakerFeeRate: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    supportedOrderTypes: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.ENUM(Object.values(ORDER_TYPE))),
    },
    marketOrderMaxSlippage: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      beforeSave: (market, options) => {
        market.baseToken = market.tokens.split('-')[0]
        market.quoteToken = market.tokens.split('-')[1]
      },
      beforeUpdate: (market, options) => {
        market.baseToken = market.tokens.split('-')[0]
        market.quoteToken = market.tokens.split('-')[1]
      },
    },
  })

  Market.associate = (models) => {
    const {
      order: Order,
      user: User,
      userMarket: UserMarket,
    } = models

    Market.hasMany(Order)
    Market.belongsToMany(User, { through: UserMarket, as: 'users' })
  }

  return Market
}

// VALIDATIONS (in controller):
// POST and PATCH user must be authenticated ADMIN
// market: must be one of MARKETS
// isMarketOrder: must comply with market.supportedOrderTypes
// amount: must be > market.minOrderSize
// amount: must comply with market.decimals
