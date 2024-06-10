const Service = require("../model/serviceSchema");

const serviceController = {
    addService: async (req, res) => {
        try {
            const { serviceName, serviceDescription, img, price, category, serviceType } = req.body;
            const newService = new Service({ serviceName, serviceDescription, img, price, category, serviceType });
            const addedNewService = await newService.save()
            if (!addedNewService) {
                return res.json({ errorMessage: "something went wrong" })
            }
            res.json({ message: "Service added", success: true });
        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
        }
    },
    getAllService: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;  // Default to page 1
            const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page

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
            res.json({ errorMessage: "something went wrong", error })
        }
    },
    deleteService: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Service.deleteOne({ _id: id });
            if (!deleted) {
                return res.json({ errorMesage: "something went wrong. Please try again" })
            }
            res.json({ message: "deleted" });
        } catch (error) {
            res.json({ errorMessage: "something went wrong. Try again" })
        }
    },
    getParticularServiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const serviceDetails = await Service({ _id: id });
            if (!serviceDetails) {
                return res.json({ message: "service is missing" })
            }
            res.json(serviceDetails);
        } catch (error) {
            res.json({ errorMesage: "something went wrong" })
        }
    },
    editService: async (req, res) => {
        try {
            const { id } = req.params;
            const { serviceName, serviceDescription, img, price, category, serviceType } = req.body;
            
            const edited = await Service.findByIdAndUpdate({ _id: id }, {serviceName, serviceDescription, img, price, category, serviceType}, { new: true })

            if(!edited){
                return res.json({message: "something went wrong"})
            }
            res.json({message:"edited", success: true})
        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
        }
    }
}

module.exports = serviceController;