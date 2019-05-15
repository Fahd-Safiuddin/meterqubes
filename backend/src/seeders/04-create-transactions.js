const moment = require('moment')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transaction', [
      {
        orderId: 14,
        txHash: '0x32834ec3c6d671a5ef8577fc05e8ae820ae7e9c013e6f049ef853cbec13a22be',
        blockDate: moment().subtract(2, 'days').format(),
        errMsg: null,
        createdAt: moment().subtract(6, 'days').format(),
        updatedAt: moment().subtract(6, 'days').format(),
      }, {
        orderId: 16,
        txHash: '0xb2084ae0dad38594a40aea5f3825ebf81d72834205be7cdb6e3eebf0b9706d2b',
        blockDate: new Date(),
        errMsg: null,
        createdAt: moment().subtract(6, 'minutes').format(),
        updatedAt: moment().subtract(6, 'minutes').format(),
      }, {
        orderId: 18,
        txHash: '0xc2084ae0dad38594a40aea5f3825ebf81d72834205be7cdb6e3eebf0b9706d2c',
        blockDate: moment().subtract(2, 'days').format(),
        errMsg: null,
        createdAt: moment().subtract(2, 'days').format(),
        updatedAt: moment().subtract(2, 'days').format(),
      }, {
        orderId: 20,
        txHash: '0xd2084ae0dad38594a40aea5f3825ebf81d72834205be7cdb6e3eebf0b9706d2d',
        blockDate: new Date(),
        errMsg: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        orderId: 23,
        txHash: '0xg2084ae0dad38594a40aea5f3825ebf81d72834205be7cdb6e3eebf0b9706d2d',
        blockDate: moment().subtract(4, 'days').format(),
        errMsg: null,
        createdAt: moment().subtract(4, 'days').format(),
        updatedAt: moment().subtract(4, 'days').format(),
      }, {
        orderId: 26,
        txHash: '0xv2084ae0dad38594a40aea5f3825ebf81d72834205be7cdb6e3eebf0b9706d2v',
        blockDate: moment().subtract(23, 'hours').format(),
        errMsg: null,
        createdAt: moment().subtract(23, 'hours').format(),
        updatedAt: moment().subtract(23, 'hours').format(),
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('transaction', null, {})
  },
}
