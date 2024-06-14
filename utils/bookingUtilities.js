const fetch = require('node-fetch');
const cron = require('node-cron');

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

// Function to send WhatsApp message
const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        const response = await fetch(process.env.GALLABOX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GALLABOX_API_KEY}`
            },
            body: JSON.stringify({
                to: phoneNumber,
                message: message
            })
        });
        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Function to schedule a reminder
const scheduleReminder = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const reminderDateTime = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);

    cron.schedule(`${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`, () => {
        const message = `Reminder: You have an appointment for ${appointment.service} at ${appointment.time} on ${appointment.date}.`;
        sendWhatsAppMessage(appointment.phoneNumber, message);
    });
};

module.exports = {formatDate, formatTime, scheduleReminder, sendWhatsAppMessage}