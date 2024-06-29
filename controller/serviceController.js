const express = require('express');
const multer = require('multer');
const path = require('path');
const Service = require('../model/serviceSchema');

// Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });


// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/'); // Ensure 'uploads' directory exists and is writable
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
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
}).single('img');



const serviceController = {
    addService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const img = req.file ? req.file.filename : '';
                const imgUrl = req.file ? `http://54.210.212.68:8000/uploads/${img}` : '';

                const newService = new Service({
                    serviceName,
                    serviceDescription,
                    img: imgUrl,
                    price,
                    category,
                    serviceType
                });

                const addedNewService = await newService.save();

                if (!addedNewService) {
                    return res.json({ errorMessage: "Something went wrong" });
                }
                res.json({ message: "Service added", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    },
    getAllService: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const allTheServices = await Service.find()
                .skip(skip)
                .limit(limit);

            const totalServices = await Service.countDocuments();

            res.json({
                totalPages: Math.ceil(totalServices / limit),
                currentPage: page,
                services: allTheServices
            });
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getTopServices: async (req, res) => {
        try {
            const topServices = await Service.find().sort({ bookingCount: -1 });
            res.json(topServices);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    deleteService: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Service.deleteOne({ _id: id });
            if (!deleted) {
                return res.json({ errorMessage: "Something went wrong. Please try again" });
            }
            res.json({ message: "Deleted" });
        } catch (error) {
            res.json({ errorMessage: "Something went wrong. Try again", error });
        }
    },
    getParticularServiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const serviceDetails = await Service.findById(id);
            if (!serviceDetails) {
                return res.json({ message: "Service is missing" });
            }
            res.json(serviceDetails);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    editService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { id } = req.params;
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const img = req.file ? req.file.filename : '';
                const imgUrl = req.file ? `http://54.210.212.68:8000/uploads/${img}` : '';

                const updatedFields = { serviceName, serviceDescription, price, category, serviceType };
                if (img) updatedFields.img = imgUrl;

                const edited = await Service.findByIdAndUpdate(id, updatedFields, { new: true });

                if (!edited) {
                    return res.json({ message: "Something went wrong" });
                }
                res.json({ message: "Edited", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    }
};

module.exports = serviceController;
