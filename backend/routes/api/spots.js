const express = require('express');
const router = express.Router();
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const{ requireAuth } = require('../../utils/auth')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const allSpots = await Spot.findAll({
    where: { ownerId: userId }
  });

  const spotsWithAvgRating = await Promise.all(
    allSpots.map(async (spot) => {
      const images = await SpotImage.findAll({
        where: {
          spotId: spot.id,
          preview: true
        },
      });

      const avgRatingResult = await Review.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ],
        where: { spotId: spot.id }
      });
      const avgRating = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
      return {
        ...spot.get(),
        avgRating,
        previewImage: images.length > 0 ? images[0].url : null,
      }
    }))
  res.json({ Spots: spotsWithAvgRating });
})

// get spot details from id
router.get('/:spotId', async (req, res) => {
  const foundSpot = await Spot.findOne({
    where: {
      id: req.params.spotId
    },
    include: [
      {
        model: User,
        as: "Owner",
        attributes: ["id", 'firstName', "lastName"]
    }
    ]
  })
  if (!foundSpot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  const spotReviews = await foundSpot.getReviews()
  foundSpot.dataValues.numReviews = spotReviews.length

  const avgRatingResult = await Review.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
    ],
    where: { spotId: foundSpot.id }
  });
  const avgStarRating = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
  foundSpot.dataValues.avgStarRating = avgStarRating

  const spotImages = await SpotImage.findAll(
    {
    where: {
        spotId: foundSpot.id
    }
  })

  foundSpot.dataValues.SpotImages = spotImages

  res.json(foundSpot)
})

// get all spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll();

  const spotsWithAvgRating = await Promise.all(
    allSpots.map(async (spot) => {
      const images = await SpotImage.findAll({
        where: {
          spotId: spot.id,
          preview: true
        },
      });

      const avgRatingResult = await Review.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ],
        where: { spotId: spot.id }
      });
      const avgRating = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
      return {
        ...spot.get(),
        avgRating,
        previewImage: images.length > 0 ? images[0].url : null,
      }
    }))
  res.json({ Spots: spotsWithAvgRating });
})

// validate post
const validatePost = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({min: 1, max: 50})
    .withMessage('Name must be between less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

// create a spot
router.post('/', requireAuth, validatePost, async (req, res) => {

  const { address, city, state, country, lat, lng, name, description, price } = req.body

  const ownerId = req.user.id

  const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
  })
  return res.status(201).json(newSpot)
})

module.exports = router;
