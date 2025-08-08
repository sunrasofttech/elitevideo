const express = require('express');
const router = express.Router();
const ShortfilmAdsController = require('../controller/shortfilm_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

router.post('/',adminAuthenticate, ShortfilmAdsController.createShortfilmAd);

router.post('/getall',adminAuthenticate, ShortfilmAdsController.getAllShortfilmAds);

router.post('/:id',adminAuthenticate, ShortfilmAdsController.getShortfilmAdById);

router.put('/:id',adminAuthenticate, ShortfilmAdsController.updateShortfilmAd);

router.delete('/:id',adminAuthenticate, ShortfilmAdsController.deleteShortfilmAd);

module.exports = router;
