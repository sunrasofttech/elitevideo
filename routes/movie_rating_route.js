const express = require('express');
const router = express.Router();
const movieRatingController = require('../controller/movie_rating_controller');

router.post('/rate', movieRatingController.addRating);

router.get('/average/:movie_id', movieRatingController.getMovieRating);

module.exports = router;