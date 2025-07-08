const express = require('express');
const router = express.Router();
const movieAdsController = require('../controller/movie_ads_controller');

router.post('/', movieAdsController.createMovieAd);
router.post('/getall', movieAdsController.getAllMovieAds);
router.post('/:id', movieAdsController.getMovieAdById);
router.put('/:id', movieAdsController.updateMovieAd);
router.delete('/:id', movieAdsController.deleteMovieAd);

module.exports = router;
