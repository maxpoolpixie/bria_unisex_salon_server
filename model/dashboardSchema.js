const mongoose = require("mongoose");

const dashboardSchema = mongoose.Schema({
    totalRevinue: {
        type: Number
    },
    allBookings: {
        type: Number
    },
    activeSessions: {
        type: Number
    },
    totalRevinueDaviation: {
        type: Number
    },
    allBookingsDaviation: {
        type: Number
    },
    activeSessionsDaviation: {
        type: Number
    },

})

const Dashboard = new mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;