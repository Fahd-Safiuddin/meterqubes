
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('matchedOrder', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'order',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      matchedOrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'order',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transaction',
          key: 'id',
        },
      },
      baseTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },
      quoteTokenAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(24, 0),
      },

    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('matchedOrder')
  },
}
