const express = require('express');
const router = express.Router();
const liveTvChannelAdsController = require('../controller/livetv_channel_ads_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

router.post('/',adminAuthenticate, liveTvChannelAdsController.createLiveTvChannelAd);
router.post('/getall',adminAuthenticate, liveTvChannelAdsController.getAllLiveTvChannelAds);
router.post('/:id',adminAuthenticate, liveTvChannelAdsController.getLiveTvChannelAdById);
router.put('/:id',adminAuthenticate, liveTvChannelAdsController.updateLiveTvChannelAd);
router.delete('/:id',adminAuthenticate, liveTvChannelAdsController.deleteLiveTvChannelAd);

module.exports = router;
