'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Yankee_Stadium_overhead_2010.jpg/280px-Yankee_Stadium_overhead_2010.jpg"
      },
      {
        reviewId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Citi_Field_%2848613685207%29.jpg/350px-Citi_Field_%2848613685207%29.jpg"
      },
      {
        reviewId: 3,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/ATT_Sunset_Panorama.jpg/300px-ATT_Sunset_Panorama.jpg"
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
