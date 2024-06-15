const Offer = require("../model/offerSchema");


const offerController = {
    addOffer: async (req, res) => {
        const { offerName, offerImg, startDate, endDate, usageLimit } = req.body;
        const newOffer = new Offer({ offerName, offerImg, startDate, endDate, usageLimit })
        const addedOffer = await newOffer.save();

        if (!addedOffer) {
            return res.json({ errorMessage: "something went wrong" })
        }
        res.json({ message: "offer added", success: true });
    },
    getAllOffer: async (req, res) => {
        const allOffer = await Offer.find();
        res.json(allOffer)
    },
    getAllActiveOffer: async (req, res) => {
        const allOffer = await Offer.find();
        const allActiveOffer = allOffer.filter(item => item.status == "Active");
        res.json(allActiveOffer);
    },
    getAllInactiveOffer: async (req, res) => {
        const allOffer = await Offer.find();
        const allInactiveOffer = allOffer.filter(item => item.status == "Inactive");
        res.json(allInactiveOffer);
    },
    getParticularOfferById: async (req, res) => {
        try {
            const { id } = req.params;
            const offerDetails = await Offer.findOne({ _id: id });
            if (!offerDetails) {
                return res.json({ message: "Offer is missing" })
            }
            res.json(offerDetails);
        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
        }
    },
    editOffer: async (req, res) => {
        try {
            const { id } = req.params;
            const { offerName, offerImg, startDate, endDate, usageLimit, status } = req.body;
            const editedOffer = await Offer.findOneAndUpdate({ _id: id }, { offerName, offerImg, startDate, endDate, usageLimit, status }, { new: true })

            if (!editedOffer) {
                return res.json({ message: "something went wrong. please try again" })
            }
            res.json({ message: "edited", success: true })
        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
        }
    }
}

module.exports = offerController