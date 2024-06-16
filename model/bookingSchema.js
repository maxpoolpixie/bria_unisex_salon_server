const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    name: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    service: [{
        serviceName: {
            type: String,
        },
        servicePrice: {
            type: Number,
        },
        serviceImg: {
            type: String
        }
    }],
    date: {
        type: String,
        index: true
    },
    time: {
        type: String,
        index:true
    },
    confirmationCode: {
        type: String
    }
})

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;