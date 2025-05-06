const admin = require('./config/firebase-config');

const sendNotification = async (message) => {
    console.log("Sending notification:", message.sender)
    const payload = {
        notification: {
            title: message.sender,
            body: message.content,
        },
        topic: 'request',
    };
    try {
        // Send notification to a specific topic
        await admin.messaging().send(payload);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = {
    sendNotification,
};
