'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('userSettings', {
    settingField: DataTypes.STRING,
  }, {
    timestamp: false,
  })
  UserSettings.associate = function (models) {
    UserSettings.belongsTo(models.user)
  }
  return UserSettings
}
