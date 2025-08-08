const express = require('express');
const router = express.Router();
const ShortfilmAdsController = require('../controller/shortfilm_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/', ShortfilmAdsController.createShortfilmAd);

router.post('/getall', ShortfilmAdsController.getAllShortfilmAds);

router.post('/:id', ShortfilmAdsController.getShortfilmAdById);

router.put('/:id', ShortfilmAdsController.updateShortfilmAd);

router.delete('/:id', ShortfilmAdsController.deleteShortfilmAd);

module.exports = router;
