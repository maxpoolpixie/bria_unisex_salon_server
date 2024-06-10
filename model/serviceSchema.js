const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
    serviceName: {
        type: String
    },
    serviceDescription: {
        type: String
    },
    img: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: String // for men or women
    },
    bookingCount: {
        type: Number,
        default:0
    },
    serviceType: {
        type: String
    }
})

const Service = new mongoose.model("Service", serviceSchema)

module.exports = Service;