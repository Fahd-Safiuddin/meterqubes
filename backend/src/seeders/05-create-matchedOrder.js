module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('matchedOrder', [
      {
        parentId: 14,
        matchedOrderId: 15,
        transactionId: 1,
        baseTokenAmount: 1000000000000000,
        quoteTokenAmount: 500000000000000,
      }, {
        parentId: 16,
        matchedOrderId: 17,
        transactionId: 2,
        baseTokenAmount: 900000000000000,
        quoteTokenAmount: 450000000000000,
      }, {
        parentId: 18,
        matchedOrderId: 19,
        transactionId: 3,
        baseTokenAmount: 5000000000000000,
        quoteTokenAmount: 25000000000000000,
      }, {
        parentId: 20,
        matchedOrderId: 21,
        transactionId: 4,
        baseTokenAmount: 900000000000000,
        quoteTokenAmount: 405000000000000,
      }, {
        parentId: 20,
        matchedOrderId: 22,
        transactionId: 4,
        baseTokenAmount: 100000000000000,
        quoteTokenAmount: 35600000000000,
      }, {
        parentId: 23,
        matchedOrderId: 24,
        transactionId: 5,
        baseTokenAmount: 700000000000000,
        quoteTokenAmount: 245000000000000,
      }, {
        parentId: 26,
        matchedOrderId: 27,
        transactionId: 6,
        baseTokenAmount: 700000000000000,
        quoteTokenAmount: 245000000000000,
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('matchedOrder', null, {})
  },
}
