const Offer = require("../model/offerSchema");
const multer = require('multer');
const path = require('path');
const express = require('express');
const app = express();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('offerImg');


const offerController = {
    addOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { offerName, startDate, endDate, usageLimit } = req.body;
                const offerImg = req.file ? req.file.filename : '';
                const offerImgUrl = req.file ? `https://bria-unisex-salon-server-1r2b.vercel.app/uploads/${offerImg}` : '';

                const newOffer = new Offer({
                    offerName,
                    offerImg: offerImgUrl,
                    startDate,
                    endDate,
                    usageLimit
                });

                const addedOffer = await newOffer.save();

                if (!addedOffer) {
                    return res.json({ errorMessage: "Something went wrong" });
                }
                res.json({ message: "Offer added", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    },
    getAllOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            res.json(allOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getAllActiveOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            const allActiveOffer = allOffer.filter(item => item.status === "Active");
            res.json(allActiveOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getAllInactiveOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            const allInactiveOffer = allOffer.filter(item => item.status === "Inactive");
            res.json(allInactiveOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getParticularOfferById: async (req, res) => {
        try {
            const { id } = req.params;
            const offerDetails = await Offer.findById(id);
            if (!offerDetails) {
                return res.json({ message: "Offer is missing" });
            }
            res.json(offerDetails);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    editOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { id } = req.params;
                const { offerName, startDate, endDate, usageLimit, status } = req.body;
                const offerImg = req.file ? req.file.filename : '';
                const offerImgUrl = req.file ? `https://bria-unisex-salon-server-1r2b.vercel.app/uploads/${offerImg}` : '';

                const updatedFields = { offerName, startDate, endDate, usageLimit, status };
                if (offerImg) updatedFields.offerImg = offerImgUrl;

                const editedOffer = await Offer.findByIdAndUpdate(id, updatedFields, { new: true });

                if (!editedOffer) {
                    return res.json({ message: "Something went wrong. Please try again" });
                }
                res.json({ message: "Edited", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    }
};

module.exports = offerController;
