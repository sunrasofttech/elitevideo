const express = require('express');
const router = express.Router();
const liveTvChannelAdsController = require('../controller/livetv_channel_ads_controller');

router.post('/', liveTvChannelAdsController.createLiveTvChannelAd);
router.post('/getall', liveTvChannelAdsController.getAllLiveTvChannelAds);
router.post('/:id', liveTvChannelAdsController.getLiveTvChannelAdById);
router.put('/:id', liveTvChannelAdsController.updateLiveTvChannelAd);
router.delete('/:id', liveTvChannelAdsController.deleteLiveTvChannelAd);

module.exports = router;
