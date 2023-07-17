const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async (req, res) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId, {
    include: [
      { model: Spot}
    ]
  });

  if (!spotImage) {
    return res.status(404).json({
      "message": "Spot Image couldn't be found"
    })
  }

  if (spotImage.Spot.ownerId !== req.user.id) {
    return res.status(403).json({
      "message": "Spot must belong to the current user"
    })
  }

  await spotImage.destroy();
  return res.json({
    "message": "Successfully deleted"
  })

})

module.exports = router;
