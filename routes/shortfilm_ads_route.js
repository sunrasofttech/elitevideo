const express = require('express');
const router = express.Router();
const ShortfilmAdsController = require('../controller/shortfilm_ads_controller');

router.post('/', ShortfilmAdsController.createShortfilmAd);

router.get('/', ShortfilmAdsController.getAllShortfilmAds);

router.get('/:id', ShortfilmAdsController.getShortfilmAdById);

router.put('/:id', ShortfilmAdsController.updateShortfilmAd);

router.delete('/:id', ShortfilmAdsController.deleteShortfilmAd);

module.exports = router;
