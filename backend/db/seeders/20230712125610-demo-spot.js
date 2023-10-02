'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {Spot} = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 E 161 St',
        city: 'Bronx',
        state: 'NY',
        country: 'United States of America',
        lat: 40.829167,
        lng: -73.926389,
        name: 'Yankee Stadium',
        description: 'The House That Jeter Built',
        price: 350
      },
      {
        ownerId: 2,
        address: '41 Seaver Way',
        city: 'Flushing',
        state: 'NY',
        country: 'United States of America',
        lat: 40.756944,
        lng: -73.845833,
        name: 'Citi Field',
        description: 'lol mets',
        price: 3.50
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      },
      {
        ownerId: 3,
        address: '24 Willie Mays Plaza',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.778611,
        lng: -122.389167,
        name: 'Oracle Park',
        description: 'Home of The San Francisco Giants',
        price: 2008
      }

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Yankee Stadium', 'Citi Field', 'Oracle Park'] }
    }, {});
  }
};
