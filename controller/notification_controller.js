const { sendNotification } = require('../config/message');

exports.sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ status: false, message: 'Title and message are required' });
    }

    const result = await sendNotification(title, message);
    res.status(200).json({ status: true, message: 'Notification sent to all users', data: result });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to send notification', error: error.message });
  }
};
