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
        }
    }],
    date: {
        type: String
    },
    time: {
        type: String
    },
    confirmationCode: {
        type: String
    }
})

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;