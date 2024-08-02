const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('./model/bookingSchema');
const { sendWhatsAppMessage, reminderFunctionBeforeOneHour, reminderFunctionForToday } = require('./utils/bookingUtilities');

const scheduleReminder = async () => {
    try {
        console.log('Cron job started at:', new Date().toISOString());
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        console.log(formatDate(oneHourLater), formatTimeWithAmPm(oneHourLater).toLocaleLowerCase());

        const date = formatDate(oneHourLater);
        const time = formatTimeWithAmPm(oneHourLater);
        const [hours, rest] = time.split(':');
        const minutesAmPm = rest.trim();
        const regexTime = `${hours}:${minutesAmPm}`; // Case insensitive match for AM/PM

        console.log("This is date and time-----------------",date, regexTime.toLocaleLowerCase())
        const appointments = await Booking.find({ date: date, time: regexTime.toLocaleLowerCase() });

        console.log(appointments)

        for (const appointment of appointments) {
            console.log('Sending WhatsApp message to:', appointment.phoneNumber);
            await reminderFunctionBeforeOneHour(appointment.name, appointment.phoneNumber)
        }


        // Check if the appointment is booked for today's date
        const today = formatDate(new Date());
        const appointmentsToday = await Booking.find({ date: today }).lean();

        // Get unique users for today's appointments
        const usersToRemind = new Set(appointmentsToday.map(appointment => appointment.phoneNumber));

        // Schedule a reminder for 7:00 AM for unique users
        const reminderTime = new Date();
        reminderTime.setHours(7, 0, 0, 0); // Set time to 7:00 AM

        if (now < reminderTime) {
            for (const phoneNumber of usersToRemind) {
                const userAppointments = appointmentsToday.find(appointment => appointment.phoneNumber === phoneNumber);
                if (userAppointments) {
                    console.log('Scheduling 7:00 AM reminder for:', phoneNumber);
                    await reminderFunctionForToday(userAppointments.name, phoneNumber);
                }
            }
        }

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
