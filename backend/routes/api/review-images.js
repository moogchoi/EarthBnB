const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async (req, res) => {
  const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
    include: [
      { model: Review}
    ]
  });

  if (!reviewImage) {
    res.status(404)
    res.json({
      "message": "Review Image couldn't be found"
    })
  }

  if (reviewImage.Review.userId !== req.user.id) {
    res.status(403)
    res.json({
      "message": "Review must belong to the current user"
    })
  }

  await reviewImage.destroy();
  res.json({
    "message": "Successfully deleted"
  })

})

module.exports = router;
