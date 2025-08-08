const express = require('express');
const router = express.Router();
const liveTvChannelAdsController = require('../controller/livetv_channel_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/',Authenticate, liveTvChannelAdsController.createLiveTvChannelAd);
router.post('/getall',Authenticate, liveTvChannelAdsController.getAllLiveTvChannelAds);
router.post('/:id',Authenticate, liveTvChannelAdsController.getLiveTvChannelAdById);
router.put('/:id',Authenticate, liveTvChannelAdsController.updateLiveTvChannelAd);
router.delete('/:id',Authenticate, liveTvChannelAdsController.deleteLiveTvChannelAd);

module.exports = router;
