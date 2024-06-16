const fetch = require('node-fetch');

// Function to send WhatsApp message
 const sendWhatsAppMessage = async (phoneNumber, templateName, bodyValues) => {
    try {
        const response = await fetch("https://server.gallabox.com/devapi/messages/whatsapp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': '666dfa36dbe596a3dc9eb8d4',
                'apiSecret': "8542dd9393904e95a555bc31823fffec"
            },
            body: JSON.stringify({
                "channelId": "666a90cf71cbba99d3770b7d",
                "channelType": "whatsapp",
                "recipient": {
                    "name": "shafinahnam89",
                    "phone": phoneNumber
                },
                "whatsapp": {
                    "type": "template",
                    "template": {
                        "templateName": templateName,
                        "bodyValues": bodyValues
                    }
                }
            })
        });

        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

module.exports = {sendWhatsAppMessage}
