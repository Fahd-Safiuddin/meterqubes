'use strict'
const crypto = require('crypto')
const base64url = require('base64url')
const ethUtil = require('ethereumjs-util')
const nonceSize = 64

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    nonce: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: () => base64url(crypto.randomBytes(nonceSize)),
    },
    publicAddress: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isLowercase: true,
        isAddress (value) {
          if (!ethUtil.isValidAddress(value)) {
            throw new Error('Invalid publicAddress!')
          }
        },
      },
      unique: {
        args: true,
        msg: 'publicAddress must be unique.',
        fields: [sequelize.fn('lower', sequelize.col('publicAddress'))],
      },
    },
    username: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  })

  User.associate = (models) => {
    const {
      market: Market,
      order: Order,
      userSettings: UserSettings,
      userMarket: UserMarket,
    } = models

    User.hasMany(Order)
    User.hasOne(UserSettings)

    User.belongsToMany(Market, { through: UserMarket, as: 'favorites' })
  }

  return User
}
