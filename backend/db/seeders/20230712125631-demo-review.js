'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: "Price is high but something just feels right here.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "Something feels off here, I get the sense that things will all fall apart at some point.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: "I can sense some magic happening here during the even years.",
        stars: 5
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
