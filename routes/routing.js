var express = require('express');
var router = express.Router();
const userController = require('../controller/user');
const bookingController = require('../controller/booking');
const hotelController = require('../controller/hotel');

/* USER API'S */
router.post('/register', userController.userRegisteration);
router.post('/login', userController.userLogin);
router.get('/logout', userController.userLogout);

/* Booking Api's */
router.post('/bookings/:userId/:hotelName', bookingController.bookaRoom);
router.put('/bookings/:userId', bookingController.bookingReschedule);
router.delete('/bookings/:userId/:bookingId', bookingController.cancelaBooking);
router.get('/bookings/:userId', bookingController.listOfUserBookings);

/** Hotel Api's */
router.get('/hotels', hotelController.getHotelDetails);
router.put('/reviews', hotelController.addaReview);
router.get('/reviews/:hotelName', hotelController.getAllReviews);

/** error api */
router.all('*', (req, res) => {
  res.status(404).json({
    status: 'Fail',
    message: 'Invalid Path'
  })
});


module.exports = router;
