const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const leagueController = require("../controllers/leagueController");
const bookingController = require("../controllers/bookingController");



router.get("/grounds", customerController.getGrounds);
router.get("/self", customerController.getSelf);
router.get("/bookings", bookingController.getBookings);
router.post("/bookings", bookingController.addBooking);




module.exports = router;