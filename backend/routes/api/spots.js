const express = require('express');
const router = express.Router();
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const{ requireAuth } = require('../../utils/auth')

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


module.exports = router;
