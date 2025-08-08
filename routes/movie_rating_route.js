const express = require('express');
const router = express.Router();
const movieRatingController = require('../controller/movie_rating_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/rate',Authenticate, movieRatingController.addRating);

router.post('/average/:movie_id',Authenticate, movieRatingController.getMovieRating);

module.exports = router;