const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController")

router.post("/adminLogin", adminController.login)
router.post("/submitForgetPassMail", adminController.submitForgetPassMail)
router.post("/submitForgetPassOTP", adminController.submitForgetPassOTP)
router.post("/resetPass", adminController.resetPass)

module.exports = router