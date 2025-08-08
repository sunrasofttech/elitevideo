const express = require('express');
const router = express.Router();
const movieAdsController = require('../controller/movie_ads_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',adminAuthenticate, movieAdsController.createMovieAd);
router.post('/getall',adminAuthenticate, movieAdsController.getAllMovieAds);
router.post('/:id',adminAuthenticate, movieAdsController.getMovieAdById);
router.put('/:id',adminAuthenticate, movieAdsController.updateMovieAd);
router.delete('/:id',adminAuthenticate, movieAdsController.deleteMovieAd);

module.exports = router;
