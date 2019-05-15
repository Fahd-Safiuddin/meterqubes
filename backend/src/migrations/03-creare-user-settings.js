'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      settingField: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userSettings')
  },
}
