const express = require('express');
const router = express.Router();
const movieAdsController = require('../controller/movie_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, movieAdsController.createMovieAd);
router.post('/getall',Authenticate, movieAdsController.getAllMovieAds);
router.post('/:id',Authenticate, movieAdsController.getMovieAdById);
router.put('/:id',Authenticate, movieAdsController.updateMovieAd);
router.delete('/:id',Authenticate, movieAdsController.deleteMovieAd);

module.exports = router;
