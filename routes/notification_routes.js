const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/send-notification',Authenticate, notificationController.sendNotificationToAll);

module.exports = router;
