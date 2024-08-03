const fetch = require('node-fetch');


// Fundtion to confirm user about his/her booking
const confirmationMessage = async (name, phoneNumber) => {
    try {
        // initialize Date
        const date = new Date();
        console.log("keep trying------------------------------------------------------")

        // Formatting the date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;


        // Formatting the time
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours}:${minutes} ${ampm}`;


        const response = await fetch("https://server.gallabox.com/devapi/messages/whatsapp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': '66796b85679dab2b70d1c3d8',
                'apiSecret': "ab5a4f06a3334bedbc14fee39e2359ad"
            },
            body: JSON.stringify(
                {
                    "channelId": "66743aaae9db57dbcb217bef",
                    "channelType": "whatsapp",
                    "recipient": {
                        "name": name,
                        "phone": phoneNumber.substring(1)
                    },
                    "whatsapp": {
                        "type": "template",
                        "template": {
                            "templateName": "appointment_booking_confirmation",
                            "bodyValues": {
                                "Name": name,
                                "Date": formattedDate,
                                "Time": strTime
                            }
                        }
                    }
                }
            )
        });

        const data = await response.json();
        console.log('Message sent: ---------------------------------------------', data);

    } catch (error) {
        res.json({ success: false, error })
    }
}


// Function to send reminder message at 7AM if customer booked any service today
const reminderFunctionForToday = async (name, phoneNumber) => {
    try {
        const response = await fetch("https://server.gallabox.com/devapi/messages/whatsapp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': '66796b85679dab2b70d1c3d8',
                'apiSecret': "ab5a4f06a3334bedbc14fee39e2359ad"
            },
            body: JSON.stringify(
                {
                    "channelId": "66743aaae9db57dbcb217bef",
                    "channelType": "whatsapp",
                    "recipient": {
                        "name": `${name}`,
                        "phone": `${phoneNumber}`
                    },
                    "whatsapp": {
                        "type": "template",
                        "template": {
                            "templateName": "reminder_message"
                        }
                    }
                }
            )
        });

        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


// Function to send reminder message before 1 hour
const reminderFunctionBeforeOneHour = async (name, phoneNumber) => {
    try {

        // initialize Date
        const date = new Date();

        // Formatting the date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Formatting the time
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours}:${minutes} ${ampm}`;

        const response = await fetch("https://server.gallabox.com/devapi/messages/whatsapp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': '66796b85679dab2b70d1c3d8',
                'apiSecret': "ab5a4f06a3334bedbc14fee39e2359ad"
            },
            body: JSON.stringify(
                {
                    "channelId": "66743aaae9db57dbcb217bef",
                    "channelType": "whatsapp",
                    "recipient": {
                        "name": `${name}`,
                        "phone": `${phoneNumber}`
                    },
                    "whatsapp": {
                        "type": "template",
                        "template": {
                            "templateName": "appointment_booking_confirmation_hour",
                            "bodyValues": {
                                "Name": name,
                                "Date": formattedDate,
                                "Time": strTime
                            }
                        }
                    }
                }
            )
        });

        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};




module.exports = { confirmationMessage, reminderFunctionForToday, reminderFunctionBeforeOneHour }
