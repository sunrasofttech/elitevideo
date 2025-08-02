const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_channel_controller');
const upload = require('../utils/uploadToSpace');

const multiUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 }
]);

router.post('/', multiUpload, controller.createChannel);
router.post('/get-all', controller.getAllChannels);
router.post('/:id', controller.getChannelById);
router.put('/:id', multiUpload, controller.updateChannel);
router.delete('/', controller.deleteChannel);

module.exports = router;
