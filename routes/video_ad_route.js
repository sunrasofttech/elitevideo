const express = require('express');
const router = express.Router();
const videoAdsController = require('../controller/video_ads_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

// Routes
router.post('/', upload.single('ad_video'),Authenticate, videoAdsController.createVideoAd);
router.post('/get-all',Authenticate, videoAdsController.getAllVideoAds);
router.post('/:id',Authenticate, videoAdsController.getVideoAdById);
router.put('/:id', upload.single('ad_video'),Authenticate, videoAdsController.updateVideoAd);
router.delete('/:id',Authenticate, videoAdsController.deleteVideoAd);

module.exports = router;
