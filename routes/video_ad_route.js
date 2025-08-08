const express = require('express');
const router = express.Router();
const videoAdsController = require('../controller/video_ads_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

// Routes
router.post('/', upload.single('ad_video'), videoAdsController.createVideoAd);
router.post('/get-all', videoAdsController.getAllVideoAds);
router.post('/:id', videoAdsController.getVideoAdById);
router.put('/:id', upload.single('ad_video'), videoAdsController.updateVideoAd);
router.delete('/:id', videoAdsController.deleteVideoAd);

module.exports = router;
