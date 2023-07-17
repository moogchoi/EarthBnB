const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

// get all current user bookings

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

  return res.json({ Bookings: allBookingsWithPreviewImage });
});

// validate booking dates
// const validateBookingDates = (req, res, next) => {
//   const { startDate, endDate } = req.body;

//   if (startDate >= endDate) {
//       res.json({
//         message: "Bad Request",
//             errors: {
//                 endDate: "endDate cannot come before startDate"
//             }
//       })
//   }
//   next()
// }

// edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body

  const editBooking = await Booking.findByPk(req.params.bookingId);

  if (!editBooking) {
    return res.status(404).json({"message": "Booking couldn't be found"})
  }

  if (editBooking.userId !== req.user.id) {
    return res.status(403).json({
      "message": "Booking must belong to the current user"
    })
  }

  const endDateTime = new Date(editBooking.endDate).getTime()
  const currentTime = Date.now();
  if (endDateTime <= currentTime) {
    return res.status(403).json({
      "message": "Past bookings can't be modified"
    })
  }

  if (startDate >= endDate) {
    return res.status(400).json({
      message: "Bad Request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
    })
  }

  const existingBooking = await Booking.findOne({
    where: {
      spotId: editBooking.spotId,
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

  const newBooking = await editBooking.update({
    startDate,
    endDate
  })

  return res.json(newBooking)

})

// delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const deleteBooking = await Booking.findByPk(req.params.bookingId);

  if (!deleteBooking) {
    return res.status(404).json({
      "message": "Booking couldn't be found"
    })
  }

  const currentUser = req.user.id;
  if (deleteBooking.userId !== currentUser && booking.Spot.ownerId !== currentUser) {
    return res.status(403).json({
      "message": "Booking must belong to the current user or the Spot must belong to the current user"
    })
  }

  const currentTime = Date.now();
  if (deleteBooking.startDate < currentTime) {
    return res.status(403).json({
      "message": "Bookings that have been started can't be deleted"
    })
  }

  await deleteBooking.destroy()
  return res.json({
    "message": "Successfully deleted"
  })

})

module.exports = router;
