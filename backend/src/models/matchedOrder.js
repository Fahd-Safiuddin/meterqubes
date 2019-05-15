'use strict'

module.exports = (sequelize, DataTypes) => {
  const MatchedOrder = sequelize.define('matchedOrder', {
    baseTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
    quoteTokenAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(24, 0),
    },
  }, {
    timestamps: false,
  })

  MatchedOrder.associate = (models) => {
    MatchedOrder.belongsTo(models.order, { as: 'parentOrder', foreignKey: 'parentId' })
    MatchedOrder.belongsTo(models.order, { as: 'matchedOrder', foreignKey: 'matchedOrderId' })
    MatchedOrder.belongsTo(models.transaction)
  }

  return MatchedOrder
}
