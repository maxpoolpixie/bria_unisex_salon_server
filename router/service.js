const express = require("express")
const router = express.Router();

const serviceController = require("../controller/serviceController");

router.post("/addService", serviceController.addService)
router.get("/getAllService", serviceController.getAllService)
router.get("/getTopServices", serviceController.getTopServices)
router.get("/getParticularServiceById/:id", serviceController.getParticularServiceById)
router.delete("/deleteService/:id", serviceController.deleteService)
router.put("/editService/:id", serviceController.editService)


module.exports = router;