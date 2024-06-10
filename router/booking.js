const express = require("express");
const router = express.Router();

//controllers
const bookingController = require("../controller/bookingController");

router.post("/addBooking", bookingController.addBooking)
router.get("/getAllBooking", bookingController.getAllBooking);
router.get("/getRecentOffer", bookingController.getRecentBooking);

module.exports = router;