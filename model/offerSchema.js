const mongoose = require("mongoose");

const offerSchema =  mongoose.Schema({
    offerName: {
        type: String
    },
    offerImg: {
        type: String
    },
    startDate:{
        type: String
    },
    endDate:{
        type: String
    },
    usageLimit:{
        type: Number
    },
    status:{
        type: String,
        default: "Active"
    }
})

const Offer = new mongoose.model("Offer", offerSchema);

module.exports =  Offer;