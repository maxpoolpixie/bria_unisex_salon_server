const express = require("express"); 
const router = express.Router();

const dashboardController = require("../controller/dashboardController");

router.get("/dashboard", dashboardController.getDashboardData)

module.exports = router;