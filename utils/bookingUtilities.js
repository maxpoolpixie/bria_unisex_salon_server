const fetch = require('node-fetch');

// Function to send WhatsApp message
const sendWhatsAppMessage = async (phoneNumber, templateName, bodyValues) => {
    try {
        console.log(phoneNumber, templateName, bodyValues)
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
                        "name": "shafinahnam89",
                        "phone": phoneNumber
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

module.exports = { sendWhatsAppMessage }
