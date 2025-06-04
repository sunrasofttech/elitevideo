const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification_controller');

router.post('/send-notification', notificationController.sendNotificationToAll);

module.exports = router;
