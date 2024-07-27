const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('./model/bookingSchema');
const { sendWhatsAppMessage } = require('./utils/bookingUtilities');

const scheduleReminder = async () => {
    try {
        console.log('Cron job started at:', new Date().toISOString());
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        console.log(formatDate(oneHourLater), formatTimeWithAmPm(oneHourLater));

        const date = formatDate(oneHourLater);
        const time = formatTimeWithAmPm(oneHourLater);
        const [hours, rest] = time.split(':');
        const minutesAmPm = rest.trim();
        const regexTime = new RegExp(`^0?${hours}:${minutesAmPm}$`, 'i'); // Case insensitive match for AM/PM

        const appointments = await Booking.find({ date: date, time: { $regex: regexTime } }).lean();

        for (const appointment of appointments) {
            console.log('Sending WhatsApp message to:', appointment.phoneNumber);
            await reminderFunctionBeforeOneHour(appointment.name, appointment.phoneNumber)
        }

        
        // i want , if user book any appointment at today's date, then, call this function -----reminderFunctionForToday(name, phoneNumber)----- for that user at 7:00AM
        // if the user repeat appointment in same date,,,then please dont call this function twice for the user. Only one time is enough
        

    } catch (error) {
        console.error('Error in scheduleReminder:', error);
    }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', scheduleReminder);

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatTimeWithAmPm(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${amPm}`;
}

module.exports = { scheduleReminder };
