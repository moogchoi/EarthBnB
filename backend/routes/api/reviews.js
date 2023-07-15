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

// add an image to a review based on the review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    res.status(404);
    res.json({
      "message": "Review couldn't be found"
    })
  }
  if (review.userId !== req.user.id) {
    res.status(403);
    res.json({
      "message": "Review must belong to the current user"
    })
  }
  const reviewImageCount = await ReviewImage.count({
    where: { reviewId: req.params.reviewId}
  })
  if (reviewImageCount > 10){
    res.status(403);
    res.json({
      "message": "Maximum number of images for this resource was reached"
    })
  }
  const { url } = req.body;
  const newImage = await ReviewImage.create({reviewId: req.params.reviewId, url})
  return res.status(201).json(newImage)
})

// review validator
const reviewValidator = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

// edit a review
router.put('/:reviewId', reviewValidator, requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if(!review){
    return res.status(404).json({"message": "Review couldn't be found"})
  }

  if (review.userId !== req.user.id) {
    res.status(403);
    res.json({
      "message": "Review must belong to the current user"
    })
  }

  const updateReview = await review.update({
    review: req.body.review,
    stars: req.body.stars
  })
  res.json(updateReview)
});

// delete a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId);

  if(!review){
    return res.status(404).json({"message": "Review couldn't be found"})
  }

  if (review.userId !== req.user.id) {
    res.status(403);
    res.json({
      "message": "Review must belong to the current user"
    })
  }

  await review.destroy()
  res.json({
    "message": "Successfully deleted"
  })
});

module.exports = router;
