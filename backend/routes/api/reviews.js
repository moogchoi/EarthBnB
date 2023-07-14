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
        model:Spot,
        include: [
            {
                model: SpotImage,
                as: 'previewImage',
                attributes: ['url']
            }
        ],
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price' ]
      },
      {
        model: ReviewImage,
        attributes: ["id", 'url']
      },
    ]
  })
  res.json({ Reviews: allReviews})
})

module.exports = router;
