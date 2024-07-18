const { uid } = require("uid");
const fetch = require('node-fetch');
const cron = require('node-cron');

// requiring Model
const Booking = require("../model/bookingSchema");
const User = require("../model/userSchema");
const Service = require("../model/serviceSchema");
const { sendWhatsAppMessage } = require("../utils/bookingUtilities");


function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
console.log(1)
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}


const bookingController = {
    addBooking: async (req, res) => {
        try {
            const { name, phoneNumber, service, date, time } = req.body;

            // verifying all the field's existence
            if (!(name && phoneNumber && service && date && time)) {
                return res.json({ message: "Please fill up all the fields" });
            }

            const confirmationCode = uid(6);
            const booking = new Booking({ name, phoneNumber: phoneNumber.slice(1), service, date, time, confirmationCode });
            const bookingAdded = await booking.save();

            if (!bookingAdded) {
                return res.json({ error: "Booking incomplete. Please try again" });
            }

            const userAlreadyExist = await User.findOne({ name, phoneNumber });
            if (!userAlreadyExist) {
                const creatingUser = new User({ name, phoneNumber });
                await creatingUser.save();
            }

            const user = await User.findOne({ name, phoneNumber });
            const { howMuchRepeat } = user;
            const newRepetitions = howMuchRepeat + 1;

            const bookingDate = formatDate(new Date());
            const bookingTime = formatTime(new Date());

            const lastAppearanceDate = {
                date: bookingDate,
                time: bookingTime
            };

            let totalSpentByUser = user.totalSpent;

            for (const iterator of service) {
                const serviceDetails = await Service.findOne({ serviceName: iterator.serviceName });
                const { bookingCount } = serviceDetails;
                const { servicePrice } = iterator;

                const updatedBookingCount = bookingCount + 1;
                totalSpentByUser += servicePrice;

                await Service.findOneAndUpdate({ serviceName: iterator.serviceName }, { bookingCount: updatedBookingCount }, { new: true });
            }

            await User.findOneAndUpdate({ name, phoneNumber }, { howMuchRepeat: newRepetitions, lastAppearanceDate, totalSpent: totalSpentByUser }, { new: true });
            if (newRepetitions > 1) {
                await User.findOneAndUpdate({ name, phoneNumber }, { isRepeat: true }, { new: true });
            }


            sendWhatsAppMessage(phoneNumber, 'welcome_basic_template', { customer_name: name })
            res.json({ message: "Booking confirmed", success: true, bookingAdded });

        } catch (error) {
            console.error('Error in addBooking:', error);
            res.json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getAllBooking: async (req, res) => {
        try {
            // Get page and limit from query parameters, defaulting to page 1 and limit 12
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;

            // Calculate the number of documents to skip
            const skip = (page - 1) * limit;

            // Fetch the booking list with pagination
            const bookingList = await Booking.find().skip(skip).limit(limit);

            // Get the total count of documents for pagination info
            const totalBookings = await Booking.countDocuments();

            // Send response with booking list and pagination info
            res.json({
                totalBookings,
                totalPages: Math.ceil(totalBookings / limit),
                currentPage: page,
                bookings: bookingList
            });
        } catch (error) {
            console.error('Error in getAllBooking:', error);
            res.json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getRecentBooking: async (req, res) => {
        try {
            const allBooking = await Booking.find().sort({ date: -1, time: -1 });
            res.json(allBooking);
        } catch (error) {
            console.error('Error in getRecentBooking:', error);
            res.json({ message: "something went wrong", error: error.message });
        }
    },
    getParticularBooking: async (req, res) => {
        try {
            const { phoneNumber } = req.params;
            const a = await Booking.find();
            const b = a.filter( item => item.phoneNumber == phoneNumber) 
            const c = b.reverse();
            const d = c[0]
            if (!d) {
                return res.json({ success: false, message: "booking data is missing in database" })
            }
            res.json({ success: true, getParticularBooking:d })
        } catch (error) {
            res.json({ success: false })
        }
    }
};

module.exports = bookingController;
