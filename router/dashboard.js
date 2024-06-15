const express = require("express"); 
const router = express.Router();

const dashboardController = require("../controller/dashboardController");

router.get("/dashboard", dashboardController.getDashboardData)
router.get("/graphData", dashboardController.getGraphData)

module.exports = router;