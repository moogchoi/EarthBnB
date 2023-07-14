const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const allReviews = await Review.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: User,
        attributes: ["id", 'firstName', "lastName"]
      },
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            as: 'previewImage',
            attributes: ['url']
          }
        ],
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model: ReviewImage,
        attributes: ["id", 'url']
      },
    ],
    attributes: [
      'id',
      'userId',
      'spotId',
      'review',
      'stars',
      'createdAt',
      'updatedAt'
    ]
  });

  const formattedReviews = allReviews.map(review => {
    return {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName
      },
      Spot: {
        id: review.Spot.id,
        ownerId: review.Spot.ownerId,
        address: review.Spot.address,
        city: review.Spot.city,
        state: review.Spot.state,
        country: review.Spot.country,
        lat: review.Spot.lat,
        lng: review.Spot.lng,
        name: review.Spot.name,
        price: review.Spot.price,
        previewImage: review.Spot.previewImage.length > 0 ? review.Spot.previewImage[0].url : null
      },
      ReviewImages: review.ReviewImages.map(image => {
        return {
          id: image.id,
          url: image.url
        };
      })
    };
  });

  res.json({ Reviews: formattedReviews });
});

module.exports = router;
