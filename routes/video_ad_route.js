const express = require('express');
const router = express.Router();
const videoAdsController = require('../controller/video_ads_controller');
const upload = require('../utils/uploadToSpace');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

// Routes
router.post('/', upload.single('ad_video'),adminAuthenticate, videoAdsController.createVideoAd);
router.post('/get-all',adminAuthenticate, videoAdsController.getAllVideoAds);
router.post('/:id',adminAuthenticate, videoAdsController.getVideoAdById);
router.put('/:id', upload.single('ad_video'),adminAuthenticate, videoAdsController.updateVideoAd);
router.delete('/:id',adminAuthenticate, videoAdsController.deleteVideoAd);

module.exports = router;
