const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_channel_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

const multiUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 }
]);

router.post('/', multiUpload,Authenticate, controller.createChannel);
router.post('/get-all',Authenticate, controller.getAllChannels);
router.post('/:id',Authenticate, controller.getChannelById);
router.put('/:id', multiUpload,Authenticate, controller.updateChannel);
router.delete('/',Authenticate, controller.deleteChannel);

module.exports = router;
