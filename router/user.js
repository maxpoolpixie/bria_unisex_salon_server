const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.get("/getFrequentlyUser", userController.getFrequentlyUser);

module.exports = router;