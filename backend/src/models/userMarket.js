'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserMarket = sequelize.define('userMarket', {
    userId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    marketId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
  })

  return UserMarket
}
