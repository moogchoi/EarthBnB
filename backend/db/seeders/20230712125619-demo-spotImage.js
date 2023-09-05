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
        spotId: 1,
        url: "https://nypost.com/wp-content/uploads/sites/2/2021/01/Yankee_Stadium.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.vhb.com/globalassets/experience/markets-we-serve/real-estate/hospitality-and-sports/yankee-stadium/yankee-stadium-1.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://media.timeout.com/images/105745099/image.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Citi_Field_%2848613685207%29.jpg/350px-Citi_Field_%2848613685207%29.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://img.mlbstatic.com/mlb-images/image/private/t_16x9/t_w2208/mlb/buquq9hgrzv3vy84esad.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://cdn.vox-cdn.com/thumbor/cx2RJ6vvCKiySZZYl03gyehiEwM=/0x0:5760x2880/fit-in/1200x600/cdn.vox-cdn.com/uploads/chorus_asset/file/10454901/GettyImages_527436792.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://cdn.vox-cdn.com/thumbor/omhUhIfqZLmLrR_tLQgZnLHrPoM=/0x69:1200x744/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/46040472/2012_3_Citi-Field-Dusk1.0.0.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/ATT_Sunset_Panorama.jpg/300px-ATT_Sunset_Panorama.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a.cdn-hotels.com/gdcs/production69/d561/64dcd5f5-4692-4697-9170-7b74006a9cb3.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://static01.nyt.com/images/2021/10/08/multimedia/08CAToday-MLB-01/08CAToday-MLB-01-superJumbo.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://media.nbcbayarea.com/2022/03/15098351595-1080pnbcstations.jpg",
        preview: false
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
