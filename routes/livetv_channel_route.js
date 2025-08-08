const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_channel_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

const multiUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 }
]);

router.post('/', multiUpload,adminAuthenticate, controller.createChannel);
router.post('/admin/get-all',adminAuthenticate, controller.getAllChannels);
router.post('/get-all',Authenticate, controller.getAllChannels);
router.post('/admin/:id',adminAuthenticate, controller.getChannelById);
router.post('/:id',Authenticate, controller.getChannelById);
router.put('/:id', multiUpload,adminAuthenticate, controller.updateChannel);
router.delete('/',adminAuthenticate, controller.deleteChannel);

module.exports = router;
