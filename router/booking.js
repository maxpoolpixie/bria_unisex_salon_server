const express = require("express");
const router = express.Router();

//controllers
const bookingController = require("../controller/bookingController");

router.post("/addBooking", bookingController.addBooking)
router.get("/getAllBooking", bookingController.getAllBooking);
router.get("/getRecentBooking", bookingController.getRecentBooking);
router.get("/getParticularBooking/:phoneNumber", bookingController.getParticularBooking)


module.exports = router;