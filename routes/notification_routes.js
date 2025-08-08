const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/send-notification',adminAuthenticate, notificationController.sendNotificationToAll);

module.exports = router;
