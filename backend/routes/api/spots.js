const express = require('express');
const router = express.Router();
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
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
      const average = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
      const avgRating = parseFloat(average.toFixed(2))
      return {
        ...spot.get(),
        avgRating,
        previewImage: images.length > 0 ? images[0].url : null,
      }
    }))
    return res.json({ Spots: spotsWithAvgRating });
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
  const average = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
  const avgStarRating = parseFloat(average.toFixed(2))
  foundSpot.dataValues.avgStarRating = avgStarRating

  const spotImages = await SpotImage.findAll(
    {
    where: {
        spotId: foundSpot.id
    }
  })

  foundSpot.dataValues.SpotImages = spotImages

  return res.json(foundSpot)
})

// get all spots
router.get('/', async (req, res) => {
  let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const errors = {};

  if (page < 1) errors.page = "Page must be greater than or equal to 1";
  if (size < 1) errors.size = "Size must be greater than or equal to 1";

  if (minLat < -90)
    errors.minLat = "Minimum latitude is invalid";
  if (maxLat > 90)
    errors.maxLat = "Maximum latitude is invalid";
  if (minLng < -180)
    errors.minLng = "Minimum longitude is invalid";
  if (maxLng > 180)
    errors.maxLng = "Maximum longitude is invalid";

  if (minPrice < 0)
    errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice < 0)
    errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  let pagination = {};
  const pageNum = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const sizeNum = req.query.size === undefined ? 20 : parseInt(req.query.size);
  if (pageNum >= 1 && sizeNum >= 1) {
    pagination.limit = sizeNum;
    pagination.offset = sizeNum * (pageNum - 1);
  }

  const { count, rows } = await Spot.findAndCountAll({
    ...pagination
  });

  const spotsWithAvgRating = await Promise.all(
    rows.map(async (spot) => {
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
      const average = avgRatingResult ? avgRatingResult.dataValues.avgRating : null;
      const avgRating = parseFloat(average.toFixed(2))
      return {
        ...spot.get(),
        avgRating,
        previewImage: images.length > 0 ? images[0].url : null,
      };
    })
  );

  return res.json({
    Spots: spotsWithAvgRating,
    page: pageNum,
    size: sizeNum,
  });
});

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

// add an image to a spot based on the spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const currentUser = req.user.id;
  const selectedSpot = await Spot.findByPk(req.params.spotId);

  if (!selectedSpot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    });
  };

  if(currentUser !== selectedSpot.ownerId) {
    return res.status(403).json({
        "message": "Spot must belong to the current user"
    });
  };

  const { url, preview } = req.body;
  const newSpotImage = await SpotImage.create({
    spotId: req.params.spotId,
    url,
    preview
  });

  return res.json({
    id: newSpotImage.id,
    url: newSpotImage.url,
    preview: newSpotImage.preview
  });

});

// edit a spot
router.put('/:spotId', requireAuth, validatePost, async (req, res) => {
  const editSpot = await Spot.findByPk(req.params.spotId);
  const currentUser = req.user.id;
  const ownerId = req.user.id;

  if (!editSpot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  };
  if(currentUser !== editSpot.ownerId) {
    return res.status(403).json({
        "message": "Spot must belong to the current user"
    });
  };

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const editedSpot = await editSpot.update({
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
  return res.json(editedSpot);

});

// delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const currentUser = req.user.id;
  const deleteSpot = await Spot.findByPk(req.params.spotId);

  if (!deleteSpot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  };

  if(currentUser !== deleteSpot.ownerId) {
    return res.status(403).json({
        "message": "Spot must belong to the current user"
    });
  };

  await deleteSpot.destroy();

  return res.json({
    "message": "Successfully deleted"
  })

});

// get all reviews by a spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if(!spot){
      return res.status(404).json({"message": "Spot couldn't be found"})
  }
  const allReviews = await Review.findAll({
    where: {
      spotId: spotId
    },
    include: [
      {
        model: User,
        attributes: ["id", 'firstName', "lastName"]
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
  return res.json({ Reviews: allReviews });
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

// create a review for a spot based on ther spot's id

router.post('/:spotId/reviews', reviewValidator, requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if(!spot){
    return res.status(404).json({"message": "Spot couldn't be found"})
  }

  const existingReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: req.user.id
    }
  });

  if (existingReview) {
    return res.status(500).json({
      "message": "User already has a review for this spot"
    })
  }

  const { review, stars } = req.body;
  const newReview = await Review.create({userId: req.user.id, spotId, review, stars})

  return res.status(201).json(newReview)

})

// get all bookings based on spot id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if(!spot){
    return res.status(404).json({"message": "Spot couldn't be found"})
  }

  if (req.user.id == spot.ownerId) {
    const ownerBooking = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    })
    return res.json({ Bookings: ownerBooking });
  } else {
    const notOwnerBooking = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json({ Bookings: notOwnerBooking });
  }
})

// validate booking dates
// const validateBookingDates = (req, res, next) => {
//   const { startDate, endDate } = req.body;

//   if (startDate >= endDate) {
//       res.json({
//         message: "Bad Request",
//             errors: {
//                 endDate: "endDate cannot be on or before startDate"
//             }
//       })
//   }
//   next()
// }

// create a booking based on the spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body
  const bookingSpot = await Spot.findByPk(req.params.spotId);

  if (!bookingSpot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }

  if (bookingSpot.ownerId === req.user.id) {
    return res.status(403).json({
      "message": "Spot must NOT belong to the current user"
    })
  }

  if (startDate >= endDate) {
    return res.status(403).json({
      message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
    })
  }

  const existingBooking = await Booking.findOne({
    where: {
      spotId: req.params.spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate]
          }
        }
      ]
    }
  })

  if (existingBooking) {
    return res.status(403).json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
  }
    })
  }

  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId: req.params.spotId,
    startDate: startDate,
    endDate: endDate
  })
  return res.json({ Bookings: newBooking })
})

module.exports = router;
