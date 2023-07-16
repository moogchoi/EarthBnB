const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// get all current user bookings (booking id is not showing up?)

router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include : [
      {
        model: Spot
      }
    ]
  })

  const allBookingsWithPreviewImage = await Promise.all(
    bookings.map(async (booking) => {
      const spot = booking.Spot;
      const images = await SpotImage.findAll({
        where: {
          spotId: spot.id,
          preview: true
        },
      });

      return {
        id: booking.id,
        spotId: booking.spotId,
        Spot: {
          id: spot.id,
          ownerId: spot.ownerId,
          address: spot.address,
          city: spot.city,
          state: spot.state,
          country: spot.country,
          lat: spot.lat,
          lng: spot.lng,
          name: spot.name,
          description: spot.description,
          price: spot.price,
          previewImage: images.length > 0 ? images[0].url : null
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };
    })
  );

  res.json({ Bookings: allBookingsWithPreviewImage });
});


module.exports = router;
