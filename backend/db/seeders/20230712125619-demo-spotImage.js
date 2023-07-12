'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Yankee_Stadium_overhead_2010.jpg/280px-Yankee_Stadium_overhead_2010.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Citi_Field_%2848613685207%29.jpg/350px-Citi_Field_%2848613685207%29.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/ATT_Sunset_Panorama.jpg/300px-ATT_Sunset_Panorama.jpg",
        preview: true
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
