const Booking = require("../model/bookingSchema");
const User = require("../model/userSchema");
const Service = require("../model/serviceSchema");

// Helper function to convert dd-mm-yyyy string to Date object
const convertToDate = require("../utils/dashboardUtilities");

const dashboardController = {

    getDashboardData: async (req, res) => {
        try {
            const allService = await Service.find();
            const allBookings = await Booking.find();


            let totalRevenue = 0;
            let totalBookings = 0;

            for (const iterator of allService) {
                totalRevenue += (iterator.price * iterator.bookingCount);
                totalBookings += iterator.bookingCount;
            }

            // Calculate the number of bookings in the last 24 hours
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            // Filter bookings within the last 24 hours
            const recentBookings = allBookings.filter(booking => {
                const bookingDate = convertToDate(booking.date);
                return bookingDate >= twentyFourHoursAgo && bookingDate <= now;
            });

            const recentBookingCount = recentBookings.length;


            // Calculate the number of bookings in the last 30 days
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Filter bookings within the last 30 days
            const lastThirtyDaysBookings = allBookings.filter(booking => {
                const bookingDate = convertToDate(booking.date);
                return bookingDate >= thirtyDaysAgo && bookingDate <= now;
            });


            let lastThirtyDaysRevenue = 0;
            let lastThirtyDaysBookingCount = lastThirtyDaysBookings.length;

            let serviceListOfLastThirtyDays = [];
            for (const booking of lastThirtyDaysBookings) {
                const service = booking.service;
                serviceListOfLastThirtyDays = [...serviceListOfLastThirtyDays, ...service]
            }


            for (const iterator of serviceListOfLastThirtyDays) {
                console.log(iterator)
                 lastThirtyDaysRevenue = lastThirtyDaysRevenue + iterator.servicePrice;
            }

            console.log( lastThirtyDaysRevenue)

            // Calculate deviations
            const revenueDeviation = parseFloat(((lastThirtyDaysRevenue / totalRevenue) * 100).toFixed(2));
            const bookingDeviation = parseFloat(((lastThirtyDaysBookingCount / totalBookings) * 100).toFixed(2));
            const recentBookingCountDeviation = (recentBookingCount / lastThirtyDaysBookingCount) * 100;

            res.json({
                totalRevenue,
                totalBookings,
                activeSession: recentBookingCount,
                revenueDeviation,
                bookingDeviation,
                recentBookingCountDeviation
            });

        } catch (error) {
            res.json({ errorMessage: "something went wrong", error });
        }
    }
}

module.exports = dashboardController;