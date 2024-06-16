const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('./model/bookingSchema');
const { sendWhatsAppMessage } = require('./utils/bookingUtilities');


const scheduleReminder = async () => {
    try {
        console.log('Cron job started at:', new Date().toISOString());
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        console.log('Fetching appointments for:', formatDate(oneHourLater), formatTime(oneHourLater));

        // Implementing retry logic
        const maxRetries = 5;
        let attempts = 0;
        let appointments;

        while (attempts < maxRetries) {
            try {
                appointments = await Booking.find({
                    date: formatDate(oneHourLater),
                    time: formatTime(oneHourLater)
                }).lean(); // Use lean() for faster queries
                break; // Break out of loop if query is successful
            } catch (error) {
                attempts++;
                if (attempts >= maxRetries) {
                    throw error; // Rethrow error if max retries are exceeded
                }
                console.error(`Attempt ${attempts} failed, retrying...`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 2 seconds before retrying
            }
        }

        for (const appointment of appointments) {
            console.log('Sending WhatsApp message to:', appointment.phoneNumber);
            await sendWhatsAppMessage(appointment.phoneNumber, 'welcome_basic_template', { customer_name: appointment.name });
        }
        console.log('Number of appointments processed:', appointments.length);
    } catch (error) {
        console.error('Error in scheduleReminder:', error);
    }
};



// Schedule the cron job to run every 5 minutes
cron.schedule('* * * * *', scheduleReminder);

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

module.exports = { scheduleReminder };
