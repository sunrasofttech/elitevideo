const express = require('express');
const router = express.Router();
const ShortfilmAdsController = require('../controller/shortfilm_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/',Authenticate, ShortfilmAdsController.createShortfilmAd);

router.post('/getall',Authenticate, ShortfilmAdsController.getAllShortfilmAds);

router.post('/:id',Authenticate, ShortfilmAdsController.getShortfilmAdById);

router.put('/:id',Authenticate, ShortfilmAdsController.updateShortfilmAd);

router.delete('/:id',Authenticate, ShortfilmAdsController.deleteShortfilmAd);

module.exports = router;
