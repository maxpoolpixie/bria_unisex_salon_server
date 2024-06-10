const { uid } = require("uid")

// requiring Model
const Booking = require("../model/bookingSchema");
const User = require("../model/userSchema");
const Service = require("../model/serviceSchema");

// requiring utilities function
const { formatDate, formatTime } = require("../utils/bookingUtilities")


const bookingController = {
    addBooking: async (req, res) => {
        try {
            const { name, phoneNumber, service, date, time } = req.body;

            // verifying all the field's existance
            if (!(name && phoneNumber && service && date)) {
                return res.json({ message: "Please fillup all the field" })
            }

            const confirmationCode = uid(6);
            const booking = new Booking({ name, phoneNumber, service, date, time, confirmationCode })
            const bookingAdded = await booking.save();

            if (!bookingAdded) {
                return res.json({ error: "booking incomplete. Please try again" })
            }

            const userAlreadyExist = await User.findOne({ name, phoneNumber });
            if (!userAlreadyExist) {
                const creatingUser = new User({ name, phoneNumber })
                await creatingUser.save();
            }


            const user = await User.findOne({ name, phoneNumber });

            const { howMuchRepeat } = user;
            const newRepeatations = howMuchRepeat + 1;

            const bookingDate = formatDate(new Date());
            const bookingTime = formatTime(new Date());

            const lastAppearenceDate = {
                date: bookingDate,
                time: bookingTime
            }

            let totalSpentByUser = user.totalSpent;

            for (const iterator of service) {
                const servicedetails = await Service.findOne({ serviceName: iterator.serviceName });
                const { bookingCount } = servicedetails;
                const { servicePrice } = iterator;

                const updatedBookingCount = bookingCount + 1;
                totalSpentByUser = totalSpentByUser + servicePrice;

                await Service.findOneAndUpdate({ serviceName: iterator.serviceName }, { bookingCount: updatedBookingCount }, { new: true })
            }

            await User.findOneAndUpdate({ name, phoneNumber }, { howMuchRepeat: newRepeatations, lastAppearenceDate: lastAppearenceDate, totalSpent: totalSpentByUser }, { new: true })
            if (newRepeatations > 1) {
                await User.findOneAndUpdate({ name, phoneNumber }, { isRepeat: true }, { new: true })
            }

            res.json({ message: "booking confirmed", success: true, bookingAdded })

        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
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
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getRecentBooking: async (req, res) => {
        try {
            const allBooking = await Booking.find().sort({ date: -1, time: -1 });
            res.json(allBooking);
        } catch (error) {
            res.json({ message: "something went wrong", error });
        }
    }

}

module.exports = bookingController;