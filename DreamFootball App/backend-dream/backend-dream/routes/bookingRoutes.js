// write boooking routes here   

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getBookings);
router.post('/', bookingController.addBooking); 
router.put('/:id', bookingController.updateBooking);
router.delete('/cancel/:id', bookingController.cancelBooking);
router.patch('/status/:id', bookingController.changeStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
