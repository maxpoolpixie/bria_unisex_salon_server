const express = require("express");
const router = express.Router();

const offerController = require("../controller/offerController");

router.post("/addOffer", offerController.addOffer);
router.get("/getAllOffer", offerController.getAllOffer)
router.get("/getAllActiveOffer", offerController.getAllActiveOffer)
router.get("/getAllInactiveOffer", offerController.getAllInactiveOffer)
router.get("/getParticularOfferById/:id", offerController.getParticularOfferById);
router.put("/editOffer/:id", offerController.editOffer)

module.exports = router;