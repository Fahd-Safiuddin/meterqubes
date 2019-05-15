'use strict'
const BigNumber = require('bignumber.js')

const { ORDER_SIDE, ORDER_STATUS } = require('../constants/order')

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    side: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(ORDER_SIDE)),
    },
    isMarketOrder: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    baseTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    quoteTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    initBaseTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    initQuoteTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    gasTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    data: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    signatureConfig: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    signatureR: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    signatureS: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    marketId: {
      type: DataTypes.INTEGER,
    },
    expiresAt: {
      allowNull: true,
      type: DataTypes.INTEGER,
      validate: {
        isFuture (value) {
          if (value <= (Math.floor(Date.now() / 1000))) {
            throw new Error('Invalid expiresAt value!')
          }
        },
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },
    previousStatus: {
      allowNull: true,
      type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
    },
    signature: {
      type: DataTypes.VIRTUAL(),
      get: function () {
        if (!this.signatureConfig || !this.signatureR || !this.signatureS) {
          return []
        }
        return [ this.signatureConfig, this.signatureR, this.signatureS ]
      },
    },
  })

  Order.associate = (models) => {
    Order.belongsTo(models.user)
    Order.belongsTo(models.market)

    Order.hasMany(models.transaction)
    Order.hasMany(models.matchedOrder, { as: 'matchedOrders', foreignKey: 'parentId' })
    Order.hasMany(models.matchedOrder, { as: 'matchDetails', foreignKey: 'matchedOrderId' })
  }

  Order.prototype.getAmount = async function () {
    if (!this.marketId || !this.baseTokenAmount) return null
    const market = await sequelize.models.market.findByPk(this.marketId, { attributes: ['baseTokenDecimals'] })
    return new BigNumber(this.baseTokenAmount).dividedBy(Math.pow(10, market.baseTokenDecimals))
  }

  Order.prototype.getPrice = async function () {
    if (!this.marketId || !this.quoteTokenAmount) return null

    const market = await sequelize.models.market.findByPk(this.marketId, { attributes: ['quoteTokenDecimals'] })

    return new BigNumber(this.quoteTokenAmount)
      .dividedBy(new BigNumber(await this.getAmount()))
      .dividedBy(new BigNumber(Math.pow(10, market.quoteTokenDecimals)))
  }

  return Order
}

// VALIDATIONS:
// trader: must be authenticated USER - protected route
// marketId: must be one of MARKETS
// isMarketOrder: must comply with market.supportedOrderTypes
// amount: must be > market.minOrderSize
// amount: must comply with market.decimals
// price should be 0 if isMarketOrder === true
// price should comply with market.pricePrecision and market.priceDecimals
