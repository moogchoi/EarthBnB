'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {Booking} = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-01-07',
        endDate: '2024-01-10'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-08-07',
        endDate: '2024-08-10'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-10-07',
        endDate: '2024-10-10'
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2024-01-07', '2024-08-07', '2024-10-07'] }
    }, {});
  }
};
