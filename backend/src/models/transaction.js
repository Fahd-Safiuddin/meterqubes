'use strict'

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    txHash: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'transaction hash must be unique.',
      },
    },
    blockDate: {
      type: DataTypes.DATE,
    },
    errMsg: {
      type: DataTypes.STRING,
    },
  })

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.order)

    Transaction.hasMany(models.matchedOrder)
  }

  return Transaction
}
